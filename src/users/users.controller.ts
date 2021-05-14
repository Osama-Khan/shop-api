import { Body, Controller, Delete, Get, Param, Patch, Put, Query } from '@nestjs/common';
import Log from 'src/shared/log';
import { User } from './users.entity';
import { UsersService } from './users.service';

@Controller({path: '/users'})
export class UsersController {
  constructor(private readonly usersService: UsersService) { }


  @Get()
  getUsers(
    @Query('limit') limit: string,
    @Query('include') include: string,
    @Query('orderBy') orderBy: string,
    @Query('orderDirection') orderDir: "ASC" | "DESC" | "asc" | "desc",
    @Query('filters') filters: string
  ): Promise<User[]> {
    if (limit && parseInt(limit).toString() !== limit) {
      Log.warn("Provided Limit isn't valid.");
      limit = "10";
    }

    if (orderDir && orderDir.toUpperCase() !== "ASC" && orderDir.toUpperCase() !== "DESC") {
      Log.warn("Provided Order Direction isn't valid.");
      orderDir = "ASC";
    }

    return this.usersService.findAll(parseInt(limit), include, orderBy, orderDir as "ASC" | "DESC", filters);
  }

  @Get(':id')
  getUser(@Param('id') id: string): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Put()
  setUser(@Body() user: User): Promise<User> {
    return this.usersService.insert(user);
  }

  @Delete(':id')
  removeUser(@Param('id') id: string): Promise<number> {
    return this.usersService.remove(id);
  }

  @Patch(':id')
  updateUser(@Param('id') id: string, @Body() user: User): Promise<User> {
    return this.usersService.update(id, user);
  }
}
