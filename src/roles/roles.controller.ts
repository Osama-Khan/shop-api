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
import Log from 'src/shared/log';
import { Role } from './roles.entity';
import { RolesService } from './roles.service';

@Controller({ path: '/roles' })
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  getRoles(
    @Query('limit') limit: string,
    @Query('include') include: string,
    @Query('orderBy') orderBy: string,
    @Query('orderDirection') orderDir: string,
    @Query('filters') filters: string,
  ): Promise<Role[]> {
    if (limit && parseInt(limit).toString() !== limit) {
      Log.warn("Provided Limit isn't valid.");
      limit = '10';
    }

    if (
      orderDir &&
      orderDir.toUpperCase() !== 'ASC' &&
      orderDir.toUpperCase() !== 'DESC'
    ) {
      Log.warn("Provided Order Direction isn't valid.");
    }
    orderDir = orderDir && orderDir.toUpperCase();

    return this.rolesService.findAll(
      parseInt(limit),
      include,
      orderBy,
      orderDir as 'ASC' | 'DESC',
      filters,
    );
  }

  @Get(':id')
  getRole(@Param('id') id: string): Promise<Role> {
    return this.rolesService.findOne(id);
  }

  @Put()
  setRole(@Body() role: Role): Promise<Role> {
    return this.rolesService.insert(role);
  }

  @Delete(':id')
  removeRole(@Param('id') id: string): Promise<Role> {
    return this.rolesService.remove(id);
  }

  @Patch(':id')
  updateRole(@Param('id') id: string, @Body() role: Role): Promise<Role> {
    return this.rolesService.update(id, role);
  }
}
