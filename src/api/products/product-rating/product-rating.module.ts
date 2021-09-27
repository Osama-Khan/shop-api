import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductRatingService } from './product-rating.service';
import { ProductRatingController } from './product-rating.controller';
import { ProductRating } from './product-rating.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductRating])],
  providers: [ProductRatingService],
  controllers: [ProductRatingController],
})
export class ProductRatingModule {}
