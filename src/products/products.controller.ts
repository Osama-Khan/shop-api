import { Body, Controller, Delete, Get, Param, Patch, Put, Query } from '@nestjs/common';
import Log from 'src/shared/log';
import { Product } from './products.entity';
import { ProductsService } from './products.service';

@Controller()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }


  @Get('/products')
  getProducts(
    @Query('limit') limit: string,
    @Query('include') include: string,
    @Query('orderBy') orderBy: string,
    @Query('orderDirection') orderDir: "ASC" | "DESC" | "asc" | "desc",
    @Query('filterColumn') filterCol,
    @Query('filterValue') filterVal: string
  ): Promise<Product[]> {

    if (limit && parseInt(limit).toString() !== limit) {
      Log.warn("Provided Limit isn't valid.");
      limit = "10";
    }

    if (orderDir && orderDir.toUpperCase() !== "ASC" && orderDir.toUpperCase() !== "DESC") {
      Log.warn("Provided Order Direction isn't valid.");
      orderDir = "ASC";
    }

    if (filterCol) {
      try {
        let key: keyof (Product) = filterCol;
      } catch (e) {
        Log.warn("Provided Filter Column isn't a key of product.");
        filterCol = "";
      }
    }

    return this.productsService.findAll(parseInt(limit), include, orderBy, orderDir as "ASC" | "DESC", filterCol, filterVal);
  }

  @Get('/products/:id')
  getProduct(@Param('id') id: string): Promise<Product> {
    return this.productsService.findOne(id);
  }

  @Put('/products')
  setProduct(@Body() product: Product): Promise<Product> {
    return this.productsService.insert(product);
  }

  @Delete('/products/:id')
  removeProduct(@Param('id') id: string): Promise<number> {
    return this.productsService.remove(id);
  }

  @Patch('/products/:id')
  updateProduct(@Param('id') id: string, @Body() product: Product): Promise<Product> {
    return this.productsService.update(id, product);
  }
}
