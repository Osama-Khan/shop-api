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
import { City } from './city.entity';
import { CityService } from './city.service';

@Controller({ path: '/cities' })
export class CityController {
  constructor(private readonly cityService: CityService) {}

  static validProperties = [
    'id',
    'name',
    'createdAt',
    'deletedAt',
    'updatedAt',
  ];

  @Get()
  getCitys(
    @Query('limit', new LimitValidationPipe())
    limit: number,
    @Query('include', new IncludesValidationPipe(City.relations))
    include: string[],
    @Query('orderBy', new OrderByValidationPipe(CityController.validProperties))
    orderBy: string,
    @Query('orderDirection', new OrderDirValidationPipe())
    orderDir: 'ASC' | 'DESC',
    @Query('filters', new FiltersValidationPipe(CityController.validProperties))
    filters,
  ) {
    return this.cityService.findAll(limit, include, orderBy, orderDir, filters);
  }

  @Get(':id')
  getCity(@Param('id', ParseIntPipe) id: number) {
    return this.cityService.findOne(id);
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
