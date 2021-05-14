import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
  findAll(): Promise<Category[]> {
    return this.categoriesRepository.find();
  }

  /**
   * Gets a category with given id
   * @param id The id of category to find
   * @returns A promise that resolves to the `Category` with given id
   */
  findOne(id: string): Promise<Category> {
    return this.categoriesRepository.findOne(id).then(c => {
      if (!c) throw new HttpException("Category not found!", HttpStatus.NOT_FOUND);
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
    return this.findOne(c.generatedMaps["id"]);
  }

  /**
   * Removes a category from the database
   * @param id The id of category to delete
   * @returns A promise that resolves to the `Category` removed
   */
  async remove(id: string): Promise<Category> {
    const c = await this.findOne(id);
    await this.categoriesRepository.delete(id);
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
