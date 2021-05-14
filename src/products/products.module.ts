import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product } from './products.entity';
import { Highlight } from 'src/highlights/highlights.entity';
import { Category } from 'src/categories/categories.entity';
import { User } from 'src/users/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Highlight, Category, User])],
  providers: [ProductsService],
  controllers: [ProductsController],
})
export class ProductsModule {}
