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
import { ObjectLiteral } from 'typeorm';
import { Role } from './roles.entity';
import { RolesService } from './roles.service';

@Controller({ path: '/roles' })
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  static validProperties = ['id', 'name'];

  @Get()
  getRoles(
    @Query('limit', new LimitValidationPipe())
    limit: number,
    @Query('include', new IncludesValidationPipe(Role.relations))
    include: string[],
    @Query(
      'orderBy',
      new OrderByValidationPipe(RolesController.validProperties),
    )
    orderBy: string,
    @Query('orderDirection', new OrderDirValidationPipe()) orderDir: string,
    @Query(
      'filters',
      new FiltersValidationPipe(RolesController.validProperties),
    )
    filters: ObjectLiteral | string,
  ): Promise<Role[]> {
    return this.rolesService.findAll(
      limit,
      include,
      orderBy,
      orderDir as 'ASC' | 'DESC',
      filters,
    );
  }

  @Get(':id')
  getRole(@Param('id', ParseIntPipe) id: number): Promise<Role> {
    return this.rolesService.findOne(id);
  }

  @Put()
  setRole(@Body() role: Role): Promise<Role> {
    return this.rolesService.insert(role);
  }

  @Delete(':id')
  removeRole(@Param('id', ParseIntPipe) id: number): Promise<Role> {
    return this.rolesService.remove(id);
  }

  @Patch(':id')
  updateRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() role: Role,
  ): Promise<Role> {
    return this.rolesService.update(id, role);
  }
}
