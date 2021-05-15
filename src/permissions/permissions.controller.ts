import { Controller, Get, Param, Query } from '@nestjs/common';
import Log from 'src/shared/log';
import { Permission } from './permissions.entity';
import { PermissionsService } from './permissions.service';

@Controller({ path: '/permissions' })
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get()
  getPermissions(
    @Query('limit') limit: string,
    @Query('orderBy') orderBy: string,
    @Query('orderDirection') orderDir: string,
    @Query('filters') filters: string,
  ): Promise<Permission[]> {
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

    return this.permissionsService.findAll(
      parseInt(limit),
      orderBy,
      orderDir as 'ASC' | 'DESC',
      filters,
    );
  }

  @Get(':id')
  getPermission(@Param('id') id: string): Promise<Permission> {
    return this.permissionsService.findOne(id);
  }
}
