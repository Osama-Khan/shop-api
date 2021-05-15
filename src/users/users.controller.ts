import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
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

  static validIncludes = ['roles', 'products'];
  static validProperties = ['id', 'firstName', 'lastName', 'username'];

  @Get()
  getUsers(
    @Query('limit', new LimitValidationPipe())
    limit: number,
    @Query('include', new IncludesValidationPipe(UsersController.validIncludes))
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
  getUser(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Put()
  setUser(@Body() user: User) {
    return this.usersService.insert(user);
  }

  @Delete(':id')
  removeUser(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Patch(':id')
  updateUser(@Param('id') id: string, @Body() user: User) {
    return this.usersService.update(id, user);
  }
}
