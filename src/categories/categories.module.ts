import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { Category } from './categories.entity';
import { Product } from 'src/products/products.entity';
import { Favorite } from 'src/favorite/favorite.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Product, Favorite])],
  providers: [CategoriesService],
  controllers: [CategoriesController],
})
export class CategoriesModule {}
