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
import LogHelper from 'src/shared/helpers/log.helper';
import { User } from './users.entity';
import { UsersService } from './users.service';

@Controller({ path: '/users' })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getUsers(
    @Query('limit') limit: string,
    @Query('include') include: string,
    @Query('orderBy') orderBy: string,
    @Query('orderDirection') orderDir: string,
    @Query('filters') filters: string,
  ) {
    if (limit && parseInt(limit).toString() !== limit) {
      LogHelper.warn("Provided Limit isn't valid.");
      limit = '10';
    }

    if (
      orderDir &&
      orderDir.toUpperCase() !== 'ASC' &&
      orderDir.toUpperCase() !== 'DESC'
    ) {
      LogHelper.warn("Provided Order Direction isn't valid.");
    }
    orderDir = orderDir ? orderDir.toUpperCase() : 'ASC';
    return this.usersService.findAll(
      parseInt(limit),
      include,
      orderBy,
      orderDir as 'ASC' | 'DESC',
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
