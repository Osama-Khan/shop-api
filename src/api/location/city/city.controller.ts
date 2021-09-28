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
import { City } from './city.entity';
import { CityService } from './city.service';
import FindManyOptionsDTO from 'src/shared/models/find-many-options.dto';
import FindManyValidationPipe from 'src/api/shared/pipes/filters/find-many-validation.pipe';
import FindOneValidationPipe from 'src/api/shared/pipes/filters/find-one-validation.pipe';
import FindOneOptionsDTO from 'src/shared/models/find-one-options.dto';

@Controller({ path: '/cities' })
export class CityController {
  constructor(private readonly cityService: CityService) {}

  static validProperties = [
    'id',
    'name',
    'state',
    'createdAt',
    'deletedAt',
    'updatedAt',
  ];

  @Get()
  @UsePipes(
    new FindManyValidationPipe(CityController.validProperties, City.relations),
  )
  getCities(@Query() options: FindManyOptionsDTO<City>) {
    return this.cityService.findAll(options);
  }

  @Get(':id')
  @UsePipes(
    new FindOneValidationPipe(CityController.validProperties, City.relations),
  )
  getCity(
    @Param('id', ParseIntPipe) id: number,
    @Query() options: FindOneOptionsDTO<City>,
  ) {
    return this.cityService.findOne(id, options);
  }

  @Put()
  setCity(@Body() city) {
    return this.cityService.insert(city);
  }

  @Delete(':id')
  removeCity(@Param('id', ParseIntPipe) id: number) {
    return this.cityService.remove(id);
  }

  @Patch(':id')
  updateCity(@Param('id', ParseIntPipe) id: number, @Body() city: City) {
    return this.cityService.update(id, city);
  }
}
