import { Body, Controller, Delete, Get, Param, Patch, Put } from '@nestjs/common';
import { CategoriesService } from './categories.service';

@Controller({path: '/categories'})
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  getCategories() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  getCategory(@Param('id') id) {
    return this.categoriesService.findOne(id);
  }

  @Put()
  setCategory(@Body() category) {
    return this.categoriesService.insert(category);
  }

  @Delete(':id')
  removeCategory(@Param('id') id) {
    return this.categoriesService.remove(id);
  }

  @Patch(':id')
  updateCategory(@Param('id') id, @Body() category) {
    return this.categoriesService.update(id, category);
  }
}
