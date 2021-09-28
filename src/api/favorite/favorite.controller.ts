import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Put,
  Query,
  UsePipes,
} from '@nestjs/common';
import { Favorite } from './favorite.entity';
import { FavoriteService } from './favorite.service';
import FindManyOptionsDTO from 'src/shared/models/find-many-options.dto';
import FindManyValidationPipe from 'src/api/shared/pipes/filters/find-many-validation.pipe';
import FindOneValidationPipe from 'src/api/shared/pipes/filters/find-one-validation.pipe';
import FindOneOptionsDTO from 'src/shared/models/find-one-options.dto';

@Controller({ path: '/favorites' })
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  static validProperties = [
    'id',
    'user',
    'product',
    'createdAt',
    'deletedAt',
    'updatedAt',
  ];

  @Get()
  @UsePipes(
    new FindManyValidationPipe(
      FavoriteController.validProperties,
      Favorite.relations,
    ),
  )
  getFavorites(@Query() options: FindManyOptionsDTO<Favorite>) {
    return this.favoriteService.findAll(options);
  }

  @Get(':id')
  @UsePipes(
    new FindOneValidationPipe(
      FavoriteController.validProperties,
      Favorite.relations,
    ),
  )
  getFavorite(
    @Param('id', ParseIntPipe) id: number,
    @Query() options: FindOneOptionsDTO<Favorite>,
  ) {
    return this.favoriteService.findOne(id, options);
  }

  @Get('product-count/:id')
  getProductFavoriteCount(@Param('id', ParseIntPipe) id: number) {
    return this.favoriteService.getProductFavoriteCount(id);
  }

  @Get('user-count/:id')
  getUserFavoriteCount(@Param('id', ParseIntPipe) id: number) {
    return this.favoriteService.getUserFavoriteCount(id);
  }

  @Put()
  setFavorite(@Body() favorite) {
    return this.favoriteService.insert(favorite);
  }

  @Delete(':id')
  removeFavorite(@Param('id', ParseIntPipe) id: number) {
    return this.favoriteService.remove(id);
  }
}
