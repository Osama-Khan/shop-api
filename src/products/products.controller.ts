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
import Log from 'src/shared/log';
import { Product } from './products.entity';
import { ProductsService } from './products.service';

@Controller({ path: '/products' })
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  getProducts(
    @Query('limit') limit: string,
    @Query('include') include: string,
    @Query('orderBy') orderBy: string,
    @Query('orderDirection') orderDir: string,
    @Query('filters') filters: string,
  ): Promise<Product[]> {
    if (limit && parseInt(limit).toString() !== limit) {
      Log.warn("Provided Limit isn't valid.");
      limit = '10';
    }

    if (
      orderDir &&
      orderDir.toUpperCase() !== 'ASC' &&
      orderDir.toUpperCase() !== 'DESC'
    ) {
      Log.warn("Provided Order Direction isn't valid.");
    }
    orderDir = orderDir && orderDir.toUpperCase();

    return this.productsService.findAll(
      parseInt(limit),
      include,
      orderBy,
      orderDir as 'ASC' | 'DESC',
      filters,
    );
  }

  @Get(':id')
  getProduct(@Param('id') id: string): Promise<Product> {
    return this.productsService.findOne(id);
  }

  @Put()
  setProduct(@Body() product: Product): Promise<Product> {
    return this.productsService.insert(product);
  }

  @Delete(':id')
  removeProduct(@Param('id') id: string): Promise<Product> {
    return this.productsService.remove(id);
  }

  @Patch(':id')
  updateProduct(
    @Param('id') id: string,
    @Body() product: Product,
  ): Promise<Product> {
    return this.productsService.update(id, product);
  }
}
