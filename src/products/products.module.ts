import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product } from './products.entity';
import { Highlight } from 'src/highlights/highlights.entity';
import { Favorite } from 'src/favorite/favorite.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Highlight, Favorite])],
  providers: [ProductsService],
  controllers: [ProductsController],
})
export class ProductsModule {}
