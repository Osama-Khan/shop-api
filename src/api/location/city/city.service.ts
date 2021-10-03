import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { City } from './city.entity';
import { ApiService } from 'src/shared/services/api.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CityService extends ApiService<City> {
  constructor(
    @InjectRepository(City)
    cityRepository: Repository<City>,
  ) {
    super(cityRepository, City.relations);
  }
}
