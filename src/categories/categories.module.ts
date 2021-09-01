import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { Category } from './categories.entity';
import { Product } from 'src/products/products.entity';
import { Favorite } from 'src/favorite/favorite.entity';
import { ProductsService } from 'src/products/products.service';
import { Highlight } from 'src/highlights/highlights.entity';
import { ProductImage } from 'src/products/product-image/product-image.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Product, Favorite, Highlight, ProductImage])],
  providers: [CategoriesService, ProductsService],
  controllers: [CategoriesController],
})
export class CategoriesModule {}
