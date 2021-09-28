import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Put,
  Query,
  UsePipes,
} from '@nestjs/common';
import FindManyOptionsDTO from 'src/shared/models/find-many-options.dto';
import { ProductRating } from './product-rating.entity';
import { ProductRatingService } from './product-rating.service';
import FindManyValidationPipe from 'src/api/shared/pipes/filters/find-many-validation.pipe';
import FindOneValidationPipe from 'src/api/shared/pipes/filters/find-one-validation.pipe';

@Controller({ path: '/ratings' })
export class ProductRatingController {
  constructor(private readonly ratingsService: ProductRatingService) {}

  static validProperties = [
    'id',
    'stars',
    'user',
    'title',
    'description',
    'product',
  ];

  @Get()
  @UsePipes(
    new FindManyValidationPipe(
      ProductRatingController.validProperties,
      ProductRating.relations,
    ),
  )
  getRatings(
    @Query()
    options: FindManyOptionsDTO<ProductRating>,
  ): any {
    return this.ratingsService.findAll(options);
  }

  @Get(':id')
  @UsePipes(
    new FindOneValidationPipe(
      ProductRatingController.validProperties,
      ProductRating.relations,
    ),
  )
  getRating(
    @Param('id', ParseIntPipe) id: number,
    @Query() options: FindManyOptionsDTO<ProductRating>,
  ): Promise<ProductRating> {
    return this.ratingsService.findOne(id, options);
  }

  @Put()
  setRating(@Body() rating: ProductRating): Promise<ProductRating> {
    return this.ratingsService.insert(rating);
  }

  @Delete(':id')
  removeRating(@Param('id', ParseIntPipe) id: number): Promise<ProductRating> {
    return this.ratingsService.remove(id);
  }

  @Patch(':id')
  updateRating(
    @Param('id', ParseIntPipe) id: number,
    @Body() rating: ProductRating,
  ): Promise<ProductRating> {
    return this.ratingsService.update(id, rating);
  }
}
