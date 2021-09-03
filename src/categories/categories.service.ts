import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/products/products.entity';
import { ProductsService } from 'src/products/products.service';
import FindManyOptionsDTO from 'src/shared/models/find-many-options.dto';
import IMetaModel from 'src/shared/models/meta.model';
import { ApiService } from 'src/shared/services/api.service';
import { FindConditions, Repository } from 'typeorm';
import { Category } from './categories.entity';

@Injectable()
export class CategoriesService extends ApiService<Category> {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
    @Inject(forwardRef(() => ProductsService))
    private productsService: ProductsService,
  ) {
    super(categoriesRepository, Category.relations);
  }

  /**
   * Returns a list of categories starting from given category to it's top most parent
   * @param id id of the category to fetch parents of
   * @returns A stack-like list of categories from child to parent
   */
  async getCategoryParents(
    id: number,
  ): Promise<{ id: number; name: string }[]> {
    const toRo = (c: any) => ({ id: c.id, name: c.name });
    let c = await this.findOne(id, { relations: ['parentCategory'] });
    if (c) {
      const categoryStack = [];
      while (c && c.parentCategory) {
        categoryStack.push(toRo(c.parentCategory));
        c = await this.findOne(c.parentCategory.id, {
          relations: ['parentCategory'],
        });
      }
      return categoryStack;
    } else {
      throw new NotFoundException('No category with given id!');
    }
  }

  /**
   * Returns a list of categories starting from given category to it's bottom most child
   * @param id id of the category to fetch children of
   * @returns A stack-like list of categories from parent to child
   */
  async getCategoryChildren(
    id: number,
  ): Promise<{ id: number; name: string }[]> {
    const toRo = (c: any) => ({ id: c.id, name: c.name });
    const rootCategory = await this.findOne(id, {
      relations: ['childCategories'],
    });
    if (rootCategory) {
      const categories = [];
      // Recursively pushes children into categories until child has no further children
      const pushChildrenOf = async (c: Category) => {
        if (c.childCategories) {
          const childrenPromises = c.childCategories.map(async (cat) => {
            cat = await this.categoriesRepository.findOne(cat.id, {
              relations: ['childCategories'],
            });
            await pushChildrenOf(cat);
          });
          await Promise.all(childrenPromises);
        }
        if (c.id != rootCategory.id) categories.push(toRo(c));
      };
      await pushChildrenOf(rootCategory);
      return categories;
    } else {
      throw new NotFoundException('No category with given id!');
    }
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

    const childIds = (await this.getCategoryChildren(category.id)).map(
      (c) => c.id,
    );

    // Generate condition array for all categories
    let categoryWheres: FindConditions<Product>[] = [];
    childIds.forEach((id) => {
      categoryWheres.push({ category: { id } });
    });
    categoryWheres.push({ category: { id: category.id } });

    return await this.productsService.findAll({
      ...options,
      where: categoryWheres,
    });
  }
}
