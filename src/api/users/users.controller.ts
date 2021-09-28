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
import { User } from './users.entity';
import { UsersService } from './users.service';
import FindOneOptionsDTO from 'src/shared/models/find-one-options.dto';
import FindOneValidationPipe from 'src/api/shared/pipes/filters/find-one-validation.pipe';
import FindManyOptionsDTO from 'src/shared/models/find-many-options.dto';
import FindManyValidationPipe from 'src/api/shared/pipes/filters/find-many-validation.pipe';

@Controller({ path: '/users' })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  static validProperties = ['id', 'firstName', 'lastName', 'username'];

  @Get()
  @UsePipes(
    new FindManyValidationPipe(UsersController.validProperties, User.relations),
  )
  getUsers(@Query() options: FindManyOptionsDTO<User>) {
    return this.usersService.findAll(options);
  }

  @Get(':id')
  @UsePipes(
    new FindOneValidationPipe(UsersController.validProperties, User.relations),
  )
  getUser(
    @Param('id', ParseIntPipe) id: number,
    @Query() options: FindOneOptionsDTO<User>,
  ) {
    return this.usersService.findOne(id, options);
  }

  @Get(':id/products/recent')
  getMostRecentProduct(@Param('id', ParseIntPipe) userId: number) {
    return this.usersService.getRecentProduct(userId);
  }

  @Put()
  setUser(@Body() user: User) {
    return this.usersService.insert(user);
  }

  @Delete(':id')
  removeUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }

  @Patch(':id')
  updateUser(@Param('id', ParseIntPipe) id: number, @Body() user: User) {
    return this.usersService.update(id, user);
  }

  @Patch(':id/role')
  assignRole(@Param('id', ParseIntPipe) id: number, @Query('name') roleName) {
    return this.usersService.addRole(id, roleName);
  }

  @Patch(':id/address')
  addAddress(@Param('id', ParseIntPipe) id: number, @Body() address) {
    return this.usersService.addAddress(id, address);
  }

  @Get(':id/addresses')
  getAddresses(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getAddresses(id);
  }
}
