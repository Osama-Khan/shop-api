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
import { User } from './users.entity';
import { UsersService } from './users.service';

@Controller({ path: '/users' })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  static validProperties = ['id', 'firstName', 'lastName', 'username'];

  @Get()
  getUsers(
    @Query('limit', new LimitValidationPipe())
    limit: number,
    @Query('include', new IncludesValidationPipe(User.relations))
    include: string[],
    @Query(
      'orderBy',
      new OrderByValidationPipe(UsersController.validProperties),
    )
    orderBy: string,
    @Query('orderDirection', new OrderDirValidationPipe())
    orderDir: 'ASC' | 'DESC',
    @Query(
      'filters',
      new FiltersValidationPipe(UsersController.validProperties),
    )
    filters,
  ) {
    return this.usersService.findAll(
      limit,
      include,
      orderBy,
      orderDir,
      filters,
    );
  }

  @Get(':id')
  getUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
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

  @Patch('role/:id')
  assignRole(@Param('id', ParseIntPipe) id: number, @Query('name') roleName) {
    return this.usersService.addRole(id, roleName);
  }

  @Patch('address/:id')
  addAddress(@Param('id', ParseIntPipe) id: number, @Body() address) {
    return this.usersService.addAddress(id, address);
  }
}
