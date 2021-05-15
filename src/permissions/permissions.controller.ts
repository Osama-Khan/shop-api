import { Controller, Get, Param, Query } from '@nestjs/common';
import { FiltersValidationPipe } from 'src/shared/pipes/filters/filters-validation.pipe';
import { LimitValidationPipe } from 'src/shared/pipes/filters/limit-validation.pipe';
import { OrderByValidationPipe } from 'src/shared/pipes/filters/orderby-validation.pipe';
import { OrderDirValidationPipe } from 'src/shared/pipes/filters/orderdir-validation.pipe';
import { Permission } from './permissions.entity';
import { PermissionsService } from './permissions.service';

@Controller({ path: '/permissions' })
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  static validProperties = ['id', 'name'];

  @Get()
  getPermissions(
    @Query('limit', new LimitValidationPipe()) limit: number,
    @Query(
      'orderBy',
      new OrderByValidationPipe(PermissionsController.validProperties),
    )
    orderBy: string,
    @Query('orderDirection', new OrderDirValidationPipe())
    orderDir: 'ASC' | 'DESC',
    @Query(
      'filters',
      new FiltersValidationPipe(PermissionsController.validProperties),
    )
    filters,
  ): Promise<Permission[]> {
    return this.permissionsService.findAll(limit, orderBy, orderDir, filters);
  }

  @Get(':id')
  getPermission(@Param('id') id: string): Promise<Permission> {
    return this.permissionsService.findOne(id);
  }
}
