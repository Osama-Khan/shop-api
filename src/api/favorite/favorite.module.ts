import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { FavoriteController } from './favorite.controller';
import { Favorite } from './favorite.entity';
import { FavoriteService } from './favorite.service';
import { User } from 'src/api/users/users.entity';
import { Product } from 'src/api/products/products.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Favorite, User, Product])],
  providers: [FavoriteService],
  controllers: [FavoriteController],
})
export class FavoriteModule {}
