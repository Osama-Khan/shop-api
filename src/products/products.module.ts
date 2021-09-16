import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/categories/categories.entity';
import { CategoriesService } from 'src/categories/categories.service';
import { Favorite } from 'src/favorite/favorite.entity';
import { Highlight } from 'src/highlights/highlights.entity';
import { ProductImage } from './product-image/product-image.entity';
import { ProductsController } from './products.controller';
import { Product } from './products.entity';
import { ProductsService } from './products.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Category,
      Favorite,
      Highlight,
      Product,
      ProductImage,
    ]),
  ],
  providers: [CategoriesService, ProductsService],
  controllers: [ProductsController],
})
export class ProductsModule {}
