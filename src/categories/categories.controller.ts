import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Put,
  Query,
} from '@nestjs/common';
import { FiltersValidationPipe } from 'src/shared/pipes/filters/filters-validation.pipe';
import { IncludesValidationPipe } from 'src/shared/pipes/filters/includes-validation.pipe';
import { LimitValidationPipe } from 'src/shared/pipes/filters/limit-validation.pipe';
import { OrderByValidationPipe } from 'src/shared/pipes/filters/orderby-validation.pipe';
import { OrderDirValidationPipe } from 'src/shared/pipes/filters/orderdir-validation.pipe';
import { CategoriesService } from './categories.service';

@Controller({ path: '/categories' })
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  static validProperties = ['id', 'name'];
  static validIncludes = ['parentCategory'];

  @Get()
  getPermissions(
    @Query('limit', new LimitValidationPipe()) limit: number,
    @Query(
      'include',
      new IncludesValidationPipe(CategoriesController.validIncludes),
    )
    include: string[],
    @Query(
      'orderBy',
      new OrderByValidationPipe(CategoriesController.validProperties),
    )
    orderBy: string,
    @Query('orderDirection', new OrderDirValidationPipe())
    orderDir: 'ASC' | 'DESC',
    @Query(
      'filters',
      new FiltersValidationPipe(CategoriesController.validProperties),
    )
    filters,
  ) {
    return this.categoriesService.findAll(
      limit,
      include,
      orderBy,
      orderDir,
      filters,
    );
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
