import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Country } from './country.entity';
import { ApiService } from 'src/shared/services/api.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CountryService extends ApiService<Country> {
  constructor(
    @InjectRepository(Country)
    countryRepository: Repository<Country>,
  ) {
    super(countryRepository, Country.relations);
  }
}
