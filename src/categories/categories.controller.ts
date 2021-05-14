import { Body, Controller, Delete, Get, Param, Patch, Put } from '@nestjs/common';
import { CategoriesService } from './categories.service';

@Controller()
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get('/categories')
  getCategories() {
    return this.categoriesService.findAll();
  }

  @Get('/categories/:id')
  getCategory(@Param('id') id) {
    return this.categoriesService.findOne(id);
  }

  @Put('/categories')
  setCategory(@Body() category) {
    return this.categoriesService.insert(category);
  }

  @Delete('/categories/:id')
  removeCategory(@Param('id') id) {
    return this.categoriesService.remove(id);
  }

  @Patch('/categories/:id')
  updateCategory(@Param('id') id, @Body() category) {
    return this.categoriesService.update(id, category);
  }
}
