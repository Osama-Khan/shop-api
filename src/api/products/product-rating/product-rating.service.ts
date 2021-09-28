import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiService } from 'src/shared/services/api.service';
import { ProductRating } from './product-rating.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductRatingService extends ApiService<ProductRating> {
  constructor(
    @InjectRepository(ProductRating)
    ratingsRepository: Repository<ProductRating>,
  ) {
    super(ratingsRepository, ProductRating.relations);
  }
}
