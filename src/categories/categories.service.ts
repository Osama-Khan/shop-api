import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/products/products.entity';
import { ApiService } from 'src/shared/services/api.service';
import { Repository } from 'typeorm';
import { Category } from './categories.entity';

@Injectable()
export class CategoriesService extends ApiService<Category> {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
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
    let c = await this.findOne(id);
    if (c) {
      const categoryStack = [];
      while (c && c.parentCategory) {
        categoryStack.push(toRo(c.parentCategory));
        c = await this.findOne(c.parentCategory.id);
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
    let c = await this.findOne(id);
    if (c) {
      const categoryStack = [];
      while (c && c.childCategory) {
        categoryStack.push(toRo(c.childCategory));
        c = await this.findOne(c.childCategory.id);
      }
      return categoryStack;
    } else {
      throw new NotFoundException('No category with given id!');
    }
  }

  /** Returns a list of products with the given category
   * @param name The name of category
   * @returns A list of products from the given category
   */
  async findProducts(name: string): Promise<any[]> {
    const category = await this.categoriesRepository.findOne({
      where: { name },
    });
    if (!category) {
      throw new NotFoundException('Category not found!');
    }
    const products = await this.productsRepository.find({
      relations: ['category'],
    });

    const childIds = (await this.getCategoryChildren(category.id)).map(
      (c) => c.id,
    );

    const p = products.filter((p) => {
      return (
        p.category?.id === category.id ||
        childIds.some((id) => p.category?.id === id)
      );
    });
    return p.map((p) => p.toResponseObject());
  }
}
