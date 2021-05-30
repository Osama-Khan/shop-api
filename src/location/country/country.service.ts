import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Country } from './country.entity';
import { ApiService } from 'src/shared/services/api.service';
import generateRO from 'src/shared/helpers/ro.helper';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CountryService extends ApiService<Country> {
  constructor(
    @InjectRepository(Country)
    private countryRepository: Repository<Country>,
  ) {
    super(countryRepository, generateRO, Country.relations);
  }
}
