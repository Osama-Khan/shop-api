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
  UsePipes,
} from '@nestjs/common';
import { Product } from 'src/products/products.entity';
import { Category } from './categories.entity';
import { CategoriesService } from './categories.service';
import FindManyOptionsDTO from 'src/shared/models/find-many-options.dto';
import FindManyValidationPipe from 'src/shared/pipes/filters/find-many-validation.pipe';
import FindOneOptionsDTO from 'src/shared/models/find-one-options.dto';
import FindOneValidationPipe from 'src/shared/pipes/filters/find-one-validation.pipe';

@Controller({ path: '/categories' })
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  static validProperties = ['id', 'name'];

  @Get()
  @UsePipes(
    new FindManyValidationPipe(
      CategoriesController.validProperties,
      Category.relations,
    ),
  )
  getCategories(@Query() options: FindManyOptionsDTO<Category>) {
    return this.categoriesService.findAll(options);
  }

  @Get('root')
  getRootCategories() {
    return this.categoriesService.findAll({ where: { parentCategory: null } });
  }

  @Get(':id')
  @UsePipes(
    new FindOneValidationPipe(
      CategoriesController.validProperties,
      Category.relations,
    ),
  )
  getCategory(
    @Param('id', ParseIntPipe) id: number,
    @Query() options: FindOneOptionsDTO<Category>,
  ) {
    return this.categoriesService.findOne(id, options);
  }

  @Get('parents/:id')
  getCategoryParents(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.getCategoryParents(id);
  }

  @Get('children/:id')
  getCategoryChildren(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.getCategoryChildren(id);
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

  @Get('products/:name')
  getProductsByCategory(@Param('name') category: string): Promise<Product[]> {
    return this.categoriesService.findProducts(category);
  }
}
