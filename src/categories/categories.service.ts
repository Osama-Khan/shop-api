import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
}
