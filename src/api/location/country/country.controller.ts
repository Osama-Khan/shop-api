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
import { Country } from './country.entity';
import { CountryService } from './country.service';
import FindOneValidationPipe from 'src/shared/pipes/filters/find-one-validation.pipe';
import FindManyValidationPipe from 'src/shared/pipes/filters/find-many-validation.pipe';
import FindManyOptionsDTO from 'src/shared/models/find-many-options.dto';
import FindOneOptionsDTO from 'src/shared/models/find-one-options.dto';

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
  @UsePipes(
    new FindManyValidationPipe(
      CountryController.validProperties,
      Country.relations,
    ),
  )
  getCountries(@Query() options: FindManyOptionsDTO<Country>) {
    return this.countryService.findAll(options);
  }

  @Get(':id')
  @UsePipes(
    new FindOneValidationPipe(
      CountryController.validProperties,
      Country.relations,
    ),
  )
  getCountry(
    @Param('id', ParseIntPipe) id: number,
    @Query() options: FindOneOptionsDTO<Country>,
  ) {
    return this.countryService.findOne(id, options);
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
