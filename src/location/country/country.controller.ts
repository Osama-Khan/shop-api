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
} from '@nestjs/common';
import { FiltersValidationPipe } from 'src/shared/pipes/filters/filters-validation.pipe';
import { IncludesValidationPipe } from 'src/shared/pipes/filters/includes-validation.pipe';
import { LimitValidationPipe } from 'src/shared/pipes/filters/limit-validation.pipe';
import { OrderByValidationPipe } from 'src/shared/pipes/filters/orderby-validation.pipe';
import { OrderDirValidationPipe } from 'src/shared/pipes/filters/orderdir-validation.pipe';
import { Country } from './country.entity';
import { CountryService } from './country.service';

@Controller({ path: '/countries' })
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  static validProperties = [
    'id',
    'name',
    'createdAt',
    'deletedAt',
    'updatedAt',
  ];

  @Get()
  getCountrys(
    @Query('limit', new LimitValidationPipe())
    limit: number,
    @Query('include', new IncludesValidationPipe(Country.relations))
    include: string[],
    @Query(
      'orderBy',
      new OrderByValidationPipe(CountryController.validProperties),
    )
    orderBy: string,
    @Query('orderDirection', new OrderDirValidationPipe())
    orderDir: 'ASC' | 'DESC',
    @Query(
      'filters',
      new FiltersValidationPipe(CountryController.validProperties),
    )
    filters,
  ) {
    return this.countryService.findAll(
      limit,
      include,
      orderBy,
      orderDir,
      filters,
    );
  }

  @Get(':id')
  getCountry(@Param('id', ParseIntPipe) id: number) {
    return this.countryService.findOne(id);
  }

  @Put()
  setCountry(@Body() country) {
    return this.countryService.insert(country);
  }

  @Delete(':id')
  removeCountry(@Param('id', ParseIntPipe) id: number) {
    return this.countryService.remove(id);
  }

  @Patch(':id')
  updateCountry(
    @Param('id', ParseIntPipe) id: number,
    @Body() country: Country,
  ) {
    return this.countryService.update(id, country);
  }
}
