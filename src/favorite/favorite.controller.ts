import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Put,
  Query,
} from '@nestjs/common';
import { FiltersValidationPipe } from 'src/shared/pipes/filters/filters-validation.pipe';
import { IncludesValidationPipe } from 'src/shared/pipes/filters/includes-validation.pipe';
import { LimitValidationPipe } from 'src/shared/pipes/filters/limit-validation.pipe';
import { OrderByValidationPipe } from 'src/shared/pipes/filters/orderby-validation.pipe';
import { OrderDirValidationPipe } from 'src/shared/pipes/filters/orderdir-validation.pipe';
import { Favorite } from './favorite.entity';
import { FavoriteService } from './favorite.service';

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
  getFavorites(
    @Query('limit', new LimitValidationPipe())
    limit: number,
    @Query('include', new IncludesValidationPipe(Favorite.relations))
    include: string[],
    @Query(
      'orderBy',
      new OrderByValidationPipe(FavoriteController.validProperties),
    )
    orderBy: string,
    @Query('orderDirection', new OrderDirValidationPipe())
    orderDir: 'ASC' | 'DESC',
    @Query(
      'filters',
      new FiltersValidationPipe(FavoriteController.validProperties),
    )
    filters,
  ) {
    return this.favoriteService.findAll(
      limit,
      include,
      orderBy,
      orderDir,
      filters,
    );
  }

  @Get(':id')
  getFavorite(@Param('id', ParseIntPipe) id: number) {
    return this.favoriteService.findOne(id);
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
