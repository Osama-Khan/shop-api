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
import { Address } from './address.entity';
import { AddressService } from './address.service';

@Controller({ path: '/addresses' })
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  static validProperties = [
    'id',
    'tag',
    'address',
    'user',
    'createdAt',
    'deletedAt',
    'updatedAt',
  ];

  @Get()
  getAddresses(
    @Query('limit', new LimitValidationPipe())
    limit: number,
    @Query('include', new IncludesValidationPipe(Address.relations))
    include: string[],
    @Query(
      'orderBy',
      new OrderByValidationPipe(AddressController.validProperties),
    )
    orderBy: string,
    @Query('orderDirection', new OrderDirValidationPipe())
    orderDir: 'ASC' | 'DESC',
    @Query(
      'filters',
      new FiltersValidationPipe(AddressController.validProperties),
    )
    filters,
  ) {
    return this.addressService.findAll(
      limit,
      include,
      orderBy,
      orderDir,
      filters,
    );
  }

  @Get(':id')
  getAddress(@Param('id', ParseIntPipe) id: number) {
    return this.addressService.findOne(id);
  }

  @Get('/default/:userId')
  getDefaultAddress(@Param('userId', ParseIntPipe) userId: number) {
    return this.addressService.getDefaultAddress(userId);
  }

  @Put()
  setAddress(@Body() address) {
    return this.addressService.insert(address);
  }

  @Delete(':id')
  removeAddress(@Param('id', ParseIntPipe) id: number) {
    return this.addressService.remove(id);
  }

  @Patch(':id')
  updateAddress(
    @Param('id', ParseIntPipe) id: number,
    @Body() address: Address,
  ) {
    return this.addressService.update(id, address);
  }
}
