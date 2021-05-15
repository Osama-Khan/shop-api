import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { Category } from './categories.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  /**
   * Gets all categories
   * @returns A promise that resolves to an array of `Category`
   */
  findAll(
    take = 10,
    includes = [],
    orderBy = 'createdAt',
    orderDir: 'ASC' | 'DESC' = 'DESC',
    filters: any,
  ): Promise<Category[]> {
    const returnChild =
      includes && includes.findIndex((i) => i == 'parentCategory') != -1;

    const options: FindManyOptions = {};
    options.take = take;
    options.where = filters;
    options.order = {};
    options.order[orderBy] = orderDir;
    return this.categoriesRepository.find(options).then(async (c) => {
      const cat = c.map(async (c) => {
        if (returnChild) {
          // Handle returning child category
        }
        return c;
      });
      return await Promise.all(cat);
    });
  }

  /**
   * Gets a category with given id
   * @param id The id of category to find
   * @returns A promise that resolves to the `Category` with given id
   */
  findOne(id: string): Promise<Category> {
    return this.categoriesRepository.findOne(id).then((c) => {
      if (!c)
        throw new HttpException('Category not found!', HttpStatus.NOT_FOUND);
      return c;
    });
  }

  /**
   * Inserts a category into the database
   * @param category The category object to insert
   * @returns A promise that resolves to the `Category` inserted
   */
  async insert(category: Category): Promise<Category> {
    const c = await this.categoriesRepository.insert(category);
    return this.findOne(c.generatedMaps['id']);
  }

  /**
   * Removes a category from the database
   * @param id The id of category to delete
   * @returns A promise that resolves to the `Category` removed
   */
  async remove(id: string): Promise<Category | HttpException> {
    const c = await this.findOne(id);
    try {
      await this.categoriesRepository.delete(id);
    } catch (e) {
      return new HttpException(
        `Category has products that depend on it, please delete the products with category '${c.name}' before proceeding.`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return c;
  }

  /**
   * Updates a category in the database
   * @param id The id of category to update
   * @param category Object containing the properties of category to update
   * @returns A promise that resolves to the `Category` updated
   */
  async update(id: string, category: Category): Promise<Category> {
    await this.categoriesRepository.update(id, category);
    return this.findOne(id);
  }
}
