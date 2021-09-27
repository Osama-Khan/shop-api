import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/api/categories/categories.entity';
import { CategoriesService } from 'src/api/categories/categories.service';
import { Favorite } from 'src/api/favorite/favorite.entity';
import { Highlight } from 'src/api/highlights/highlights.entity';
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
