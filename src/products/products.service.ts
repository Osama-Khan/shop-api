import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindConditions, FindOneOptions, In, Repository } from 'typeorm';
import { Product } from './products.entity';
import { ApiService } from 'src/shared/services/api.service';
import { Highlight } from 'src/highlights/highlights.entity';
import { Favorite } from 'src/favorite/favorite.entity';
import FindManyOptionsDTO from 'src/shared/models/find-many-options.dto';
import withFavoriteCount from 'src/shared/helpers/favorite-count.helper';
import { ProductImage } from './product-image/product-image.entity';
import IMetaModel from 'src/shared/models/meta.model';
import { CategoriesService } from 'src/categories/categories.service';
import { Category } from 'src/categories/categories.entity';

@Injectable()
export class ProductsService extends ApiService<Product> {
  constructor(
    @InjectRepository(Product)
    productRepository: Repository<Product>,
    @InjectRepository(Highlight)
    private highlightsRepository: Repository<Highlight>,
    @InjectRepository(ProductImage)
    private imagesRepository: Repository<ProductImage>,
    @InjectRepository(Favorite)
    private favoritesRepository: Repository<Favorite>,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
    @Inject(forwardRef(() => CategoriesService))
    private categoriesService: CategoriesService,
  ) {
    super(productRepository, Product.relations, [
      'highlights',
      'category',
      'user',
      'ratings',
      'images',
    ]);
  }

  // Attaches favoriteCount and ratings to products
  async findAll(options: FindManyOptionsDTO<Product>) {
    const hasRatings = options?.relations?.includes('ratings');

    // Add ratings relation to calculate rating of product
    if (!hasRatings) {
      if (options.relations) options.relations.push('ratings');
      else if (options) options = { ...options, relations: ['ratings'] };
      else options = { relations: ['ratings'] };
    }

    const { data, meta } = await super.findAll(options);

    // Attach favorite count of product to object
    let prods = await withFavoriteCount(data, this.favoritesRepository);
    // If ratings are not requested, attach only average stars
    if (!hasRatings) {
      prods = prods.map((p) => {
        const stars = p.ratings?.map((r) => r.stars);
        const size = stars?.length;

        // Calculate average of ratings if multiple ratings exist
        // Get the first rating stars if only one rating exists
        // Return undefined if there are no ratings
        p.rating =
          stars && stars.length > 0
            ? stars.length === 1
              ? stars[0]
              : (stars.reduce((x, y) => x + y) / size).toFixed(1)
            : undefined;

        // Remove ratings property to prevent unnecessary data transfer
        delete p.ratings;
        return p;
      });
    }
    return { data: prods, meta };
  }

  async findOne(id: number, options?: FindOneOptions<Product>) {
    if (options?.relations?.includes('favorites')) {
      return await super.findOne(id, options);
    }

    // Adding count of favorites
    const relations = options?.relations?.filter((r) => r !== 'favorites');
    const prod: any = await super.findOne(id, { relations });
    prod.favoriteCount = await this.favoritesRepository.count({
      where: { product: id },
    });
    return prod;
  }

  async insert(p: any): Promise<Product> {
    const product = await super.insert(p);
    p.highlights = this.insertRelations(
      p.highlights,
      product,
      this.highlightsRepository,
      'highlight',
    );
    p.images = this.insertRelations(
      p.images,
      product,
      this.imagesRepository,
      'image',
    );
    return product;
  }

  async update(id: number, p: any): Promise<Product> {
    const product = await super.findOne(id);
    const { highlights, images, ...prod } = p;
    await super.update(id, prod);

    // Delete previous and insert new highlights data
    if (highlights) {
      await this.highlightsRepository.delete({ product: { id } });
      product.highlights = this.insertRelations(
        highlights,
        product,
        this.highlightsRepository,
        'highlight',
      );
    }

    // Delete previous and insert new images data
    if (images) {
      await this.imagesRepository.delete({ product: { id } });
      product.images = this.insertRelations(
        images,
        product,
        this.imagesRepository,
        'image',
      );
    }
    return product;
  }

  /** Returns a list of products with the given category
   * @param name The name of category
   * @returns A list of products from the given category
   */
  async findProducts(
    name: string,
    options: FindManyOptionsDTO<Product>,
  ): Promise<{ data: any[]; meta: IMetaModel }> {
    const category = await this.categoriesRepository.findOne({
      where: { name },
    });
    if (!category) {
      throw new NotFoundException('Category not found!');
    }

    if (!options.relations) options.relations = ['category'];
    else if (!options.relations.includes('category'))
      options.relations.push('category');

    const childIds = (
      await this.categoriesService.getCategoryChildren(category.id)
    ).map((c) => c.id);
    const ids = [category.id, ...childIds];

    return await this.findAll({
      ...options,
      where: {
        category: { id: In(ids) },
        ...(options.where as any),
      },
    });
  }

  /**
   * Inserts product relation and returns array of objects containing entity property
   * @param values array of values
   * @param product product owning the entities
   * @param repo repository to use for insertion
   * @param propName name of the property containing value
   * @returns Array of objects containing the property and value
   */
  insertRelations(
    values: string[],
    product: any,
    repo: Repository<any>,
    propName: string,
  ) {
    const rels = [];
    for (const key in values) {
      const rel = {};
      rel[propName] = values[key];
      rel['product'] = product;
      const highlight = repo.create(rel);
      repo.insert(highlight);
      rels.push({ highlight: values[key] });
    }
    return rels;
  }
}
