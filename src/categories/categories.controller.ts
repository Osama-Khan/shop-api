import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Put,
  Query,
} from '@nestjs/common';
import { FiltersValidationPipe } from 'src/shared/pipes/filters/filters-validation.pipe';
import { IncludesValidationPipe } from 'src/shared/pipes/filters/includes-validation.pipe';
import { LimitValidationPipe } from 'src/shared/pipes/filters/limit-validation.pipe';
import { OrderByValidationPipe } from 'src/shared/pipes/filters/orderby-validation.pipe';
import { OrderDirValidationPipe } from 'src/shared/pipes/filters/orderdir-validation.pipe';
import { Category } from './categories.entity';
import { CategoriesService } from './categories.service';

@Controller({ path: '/categories' })
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  static validProperties = ['id', 'name'];

  @Get()
  getCategories(
    @Query('limit', new LimitValidationPipe()) limit: number,
    @Query('include', new IncludesValidationPipe(Category.relations))
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

  @Get('root')
  getRootCategories() {
    return this.categoriesService.findAll(
      undefined,
      undefined,
      undefined,
      undefined,
      { parentCategory: null },
    );
  }

  @Get(':id')
  getCategory(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.findOne(id);
  }

  @Get('parents/:id')
  getCategoryParents(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.getCategoryParents(id);
  }

  @Put()
  setCategory(@Body() category: Category) {
    return this.categoriesService.insert(category);
  }

  @Delete(':id')
  removeCategory(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.remove(id);
  }

  @Patch(':id')
  updateCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body() category: Category,
  ) {
    return this.categoriesService.update(id, category);
  }
}
