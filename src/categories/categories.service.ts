import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './categories.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  findAll(): Promise<Category[]> {
    return this.categoriesRepository.find();
  }

  findOne(id: string): Promise<Category> {
    return this.categoriesRepository.findOne(id);
  }

  async insert(category: Category): Promise<Category> {
    const c = await this.categoriesRepository.insert(category);
    return this.categoriesRepository.findOne(c.generatedMaps["id"]);
  }

  async remove(id: string): Promise<Category> {
    const c = this.categoriesRepository.findOne(id);
    await this.categoriesRepository.delete(id);
    return c;
  }

  async update(id: string, category: Category): Promise<Category> {
    await this.categoriesRepository.update(id, category);
    return this.categoriesRepository.findOne(id);
  }
}
