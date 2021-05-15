import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryDTO } from 'src/categories/categories.dto';
import { Category } from 'src/categories/categories.entity';
import { HighlightDTO } from 'src/highlights/highlights.dto';
import { Highlight } from 'src/highlights/highlights.entity';
import { User } from 'src/users/users.entity';
import { UserDTO } from 'src/users/users.dto';
import { FindManyOptions, Repository } from 'typeorm';
import { Product } from './products.entity';
import QueryHelper from 'src/shared/query.helper';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(Highlight)
    private highlightsRepository: Repository<Highlight>,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  /**
   * Finds products that match the given criteria
   * @param take The maximum number of records to return
   * @param include A semicolon separated list of related properties to include
   * @param orderBy A string representing a column of `Product` to order by
   * @param orderDir Direction to order the Product by
   * @param filters A semicolon separated list of column=value formatted filters
   * @returns A promise that resolves to an array of products
   */
  async findAll(
    take = 10,
    includes = '',
    orderBy = 'createdAt',
    orderDir: 'ASC' | 'DESC' = 'DESC',
    filters: string,
  ): Promise<Product[]> {
    const includesArray = includes ? includes.split(';') : [];
    const returnHighlights =
        includesArray.findIndex((i) => i == 'highlights') != -1,
      returnCategory = includesArray.findIndex((i) => i == 'category') != -1,
      returnUser = includesArray.findIndex((i) => i == 'user') != -1;

    const options: FindManyOptions = {};
    options.take = take;
    options.where = QueryHelper.filterObjectFrom(filters, Product.prototype);
    options.order = {};
    options.order[orderBy] = orderDir;
    return await this.productsRepository.find(options).then(async (p) => {
      const pr = p.map(async (p) => {
        if (returnHighlights) {
          p.highlights = await this.highlightsRepository
            .find({ where: { product: p } })
            .then((h) => HighlightDTO.generateRO(h));
        }
        if (returnCategory) {
          p.category = await this.categoriesRepository
            .findOne(p.category)
            .then((c) => CategoryDTO.generateRO(c));
        }
        if (returnUser) {
          p.user = await this.usersRepository
            .findOne(p.user)
            .then((u) => UserDTO.generateRO(u));
        }

        return p;
      });
      return await Promise.all(pr);
    });
  }

  /**
   * Gets a product with given id
   * @param id The id of product to find
   * @returns A promise that resolves to the `Product` with given id
   */
  async findOne(id: string): Promise<Product> {
    return await this.productsRepository.findOne(id).then(async (p) => {
      if (!p)
        throw new HttpException('Product not found!', HttpStatus.NOT_FOUND);
      p.highlights = await this.highlightsRepository
        .find({ where: { product: p } })
        .then((h) => HighlightDTO.generateRO(h));
      p.category = await this.categoriesRepository
        .findOne(p.category)
        .then((c) => CategoryDTO.generateRO(c));
      p.user = await this.usersRepository
        .findOne(p.user)
        .then((u) => UserDTO.generateRO(u));
      return p;
    });
  }

  /**
   * Removes a product from the database
   * @param id The id of product to delete
   * @returns A promise that resolves to the `Product` removed
   */
  async remove(id: string): Promise<Product> {
    const p = await this.findOne(id);
    const h = await this.highlightsRepository.find({ where: { product: p } });
    h.forEach(async (h) => await this.highlightsRepository.delete(h));
    return p;
  }

  /**
   * Inserts a product into the database
   * @param product The product object to insert
   * @returns A promise that resolves to the `Product` inserted
   */
  async insert(product): Promise<Product> {
    // Attach category to product
    const c = await this.categoriesRepository.findOne({
      where: { name: product.category },
    });
    if (c) {
      product.category = c;
    } else {
      throw new HttpException(
        'Invalid category provided',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    // Attach user to product
    const u = await this.usersRepository.findOne(product.user);
    if (u) {
      product.user = u;
    } else {
      throw new HttpException(
        'Invalid user provided',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    // Insert product
    const out = await this.productsRepository.insert(product);

    // Add Highlights
    await Promise.all(
      product.highlights.map(
        async (highlight) =>
          await this.highlightsRepository.insert({
            product,
            highlight: highlight,
          }),
      ),
    );

    // Return created product
    return await this.findOne(out.generatedMaps['id']);
  }

  /**
   * Updates a product in the database
   * @param id The id of product to update
   * @param product Object containing the properties of product to update
   * @returns A promise that resolves to the `Product` updated
   */
  async update(id: string, product: Product): Promise<Product> {
    if (product.category) {
      const c = await this.categoriesRepository.findOne({
        where: { name: product.category },
      });
      if (c) {
        product.category = c;
      } else {
        throw new HttpException(
          'Invalid category provided',
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
    }
    await this.productsRepository.update(id, product);
    return await this.findOne(id);
  }
}
