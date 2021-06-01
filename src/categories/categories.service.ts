import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import LogHelper from 'src/shared/helpers/log.helper';
import { ApiService } from 'src/shared/services/api.service';
import { Repository } from 'typeorm';
import { CategoryDTO } from './categories.dto';
import { Category } from './categories.entity';

@Injectable()
export class CategoriesService extends ApiService<Category> {
  constructor(
    @InjectRepository(Category)
    categoriesRepository: Repository<Category>,
  ) {
    super(categoriesRepository, CategoryDTO.generateRO, Category.relations);
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
}
