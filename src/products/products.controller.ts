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
import { Product } from './products.entity';
import { ProductsService } from './products.service';

@Controller({ path: '/products' })
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  static validProperties = [
    'id',
    'code',
    'title',
    'description',
    'price',
    'rating',
    'stock',
    'img',
  ];

  @Get()
  getProducts(
    @Query('limit', new LimitValidationPipe())
    limit: number,
    @Query('include', new IncludesValidationPipe(Product.relations))
    include: string[],
    @Query(
      'orderBy',
      new OrderByValidationPipe(ProductsController.validProperties),
    )
    orderBy: string,
    @Query('orderDirection', new OrderDirValidationPipe()) orderDir: string,
    @Query(
      'filters',
      new FiltersValidationPipe(ProductsController.validProperties),
    )
    filters: string,
  ): Promise<Product[]> {
    return this.productsService.findAll(
      limit,
      include,
      orderBy,
      orderDir as 'ASC' | 'DESC',
      filters,
    );
  }

  @Get(':id')
  getProduct(@Param('id', ParseIntPipe) id: number): Promise<Product> {
    return this.productsService.findOne(id);
  }

  @Put()
  setProduct(@Body() product: Product): Promise<Product> {
    return this.productsService.insert(product);
  }

  @Delete(':id')
  removeProduct(@Param('id', ParseIntPipe) id: number): Promise<Product> {
    return this.productsService.remove(id);
  }

  @Patch(':id')
  updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() product: Product,
  ): Promise<Product> {
    return this.productsService.update(id, product);
  }
}
