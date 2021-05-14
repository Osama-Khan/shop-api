import { HttpException, HttpStatus, Injectable, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryRO } from 'src/categories/categories.dto';
import { Category } from 'src/categories/categories.entity';
import { CategoriesService } from 'src/categories/categories.service';
import { HighlightRO } from 'src/highlights/highlights.dto';
import { Highlight } from 'src/highlights/highlights.entity';
import { FindManyOptions, Repository } from 'typeorm';
import { Product } from './products.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(Highlight)
    private highlightsRepository: Repository<Highlight>,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) { }

  /**
   * Finds products that match the given criteria
   * @param take The maximum number of records to return
   * @param include A comma separated list of related properties to include
   * @param orderBy A string representing a column of `Product` to order by
   * @param orderDir Direction to order the Product by
   * @param filterCol Column to use for filtering the product
   * @param filterVal Value to use for filtering the product
   * @returns A promise that resolves to an array of products
   */
  async findAll(
    take: number = 10,
    include: string = "",
    orderBy: string = "created_at",
    orderDir: "ASC" | "DESC" = "DESC",
    filterCol: keyof (Product),
    filterVal = undefined
  ): Promise<Product[]> {
    const returnHighlights = include.includes("highlights"),
      returnCategory = include.includes("category");

    let options: FindManyOptions = {};
    options.take = take;
    options.where = filterCol ? { filterCol: filterVal } : {};
    options.order = {};
    options.order[orderBy] = orderDir;
    return await this.productsRepository.find(options).then(async p => {
      let pr = p.map(async p => {
        if (returnHighlights) {
          p.highlights =
            await this.highlightsRepository.find({ where: { product: p } }).then(h =>
              HighlightRO.generate(h)
            );
        }
        if (returnCategory) {
          p.category =
            await this.categoriesRepository.find(p.category).then(c =>
              CategoryRO.generate(c)
            );
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
    return await this.productsRepository.findOne(id).then(async p => {
      if (!p) throw new HttpException("Product not found!", HttpStatus.NOT_FOUND);
      p.highlights = await this.highlightsRepository.find({ where: { product: p } }).then(h =>
        HighlightRO.generate(h)
      );
      p.category = await this.categoriesRepository.findOne(p.category).then(c =>
        CategoryRO.generate(c)
      );
      return p;
    });
  }

  /**
   * Removes a product from the database
   * @param id The id of product to delete
   * @returns A promise that resolves to the `Product` removed
   */
  async remove(id: string): Promise<Product> {
    let p = await this.findOne(id);
    let h = await this.highlightsRepository.find({ where: { product: p } });
    h.forEach(async h => await this.highlightsRepository.delete(h));
    return p;
  }

  /**
   * Inserts a product into the database
   * @param product The product object to insert
   * @returns A promise that resolves to the `Product` inserted
   */
  async insert(product): Promise<Product> {
    // Attach category to product
    const c = await this.categoriesRepository.findOne({ where: { name: product.category } });
    if (c) {
      product.category = c;
    } else {
      throw new HttpException("Invalid category provided", HttpStatus.UNPROCESSABLE_ENTITY);
    }

    // Insert product
    let out = await this.productsRepository.insert(product);

    // Add Highlights
    await Promise.all(product.highlights.map(async (highlight) =>
      await this.highlightsRepository.insert({ product, highlight: highlight })
    ));

    // Return created product
    return await this.findOne(out.generatedMaps["id"]);
  }

  /**
   * Updates a product in the database
   * @param id The id of product to update
   * @param product Object containing the properties of product to update
   * @returns A promise that resolves to the `Product` updated
   */
  async update(id: string, product: Product): Promise<Product> {
    if (product.category) {
      const c = await this.categoriesRepository.findOne({where: {name: product.category}});
      if (c) {
        product.category = c;
      } else {
        throw new HttpException("Invalid category provided", HttpStatus.UNPROCESSABLE_ENTITY);
      }
    }
    await this.productsRepository.update(id, product);
    return await this.findOne(id);
  }
}
