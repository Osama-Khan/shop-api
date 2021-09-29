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
import { Address } from './address.entity';
import { AddressService } from './address.service';
import FindManyValidationPipe from 'src/shared/pipes/filters/find-many-validation.pipe';
import FindManyOptionsDTO from 'src/shared/models/find-many-options.dto';
import FindOneValidationPipe from 'src/shared/pipes/filters/find-one-validation.pipe';
import FindOneOptionsDTO from 'src/shared/models/find-one-options.dto';

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
  @UsePipes(
    new FindManyValidationPipe(
      AddressController.validProperties,
      Address.relations,
    ),
  )
  getAddresses(@Query() options: FindManyOptionsDTO<Address>) {
    return this.addressService.findAll(options);
  }

  @Get(':id')
  @UsePipes(
    new FindOneValidationPipe(
      AddressController.validProperties,
      Address.relations,
    ),
  )
  getAddress(
    @Param('id', ParseIntPipe) id: number,
    @Query() options: FindOneOptionsDTO<Address>,
  ) {
    return this.addressService.findOne(id, options);
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
