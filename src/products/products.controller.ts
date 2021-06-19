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
import FindManyOptionsDTO from 'src/shared/models/find-many-options.dto';
import { Product } from './products.entity';
import { ProductsService } from './products.service';
import FindManyValidationPipe from 'src/shared/pipes/filters/find-many-validation.pipe';
import FindOneValidationPipe from 'src/shared/pipes/filters/find-one-validation.pipe';

@Controller({ path: '/products' })
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  static validProperties = [
    'id',
    'code',
    'user',
    'category',
    'title',
    'description',
    'price',
    'rating',
    'stock',
    'img',
  ];

  @Get()
  @UsePipes(
    new FindManyValidationPipe(
      ProductsController.validProperties,
      Product.relations,
    ),
  )
  getProducts(
    @Query()
    options: FindManyOptionsDTO<Product>,
  ): any {
    return this.productsService.findAll(options);
  }

  @Get(':id')
  @UsePipes(
    new FindOneValidationPipe(
      ProductsController.validProperties,
      Product.relations,
    ),
  )
  getProduct(
    @Param('id', ParseIntPipe) id: number,
    @Query() options: FindManyOptionsDTO<Product>,
  ): Promise<Product> {
    return this.productsService.findOne(id, options);
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
