import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { City } from './city.entity';
import { ApiService } from 'src/shared/services/api.service';
import generateRO from 'src/shared/helpers/ro.helper';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CityService extends ApiService<City> {
  constructor(
    @InjectRepository(City)
    cityRepository: Repository<City>,
  ) {
    super(cityRepository, generateRO, City.relations);
  }
}
