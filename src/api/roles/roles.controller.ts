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
import { Role } from './roles.entity';
import { RolesService } from './roles.service';
import FindManyOptionsDTO from 'src/api/shared/models/find-many-options.dto';
import FindOneOptionsDTO from 'src/api/shared/models/find-one-options.dto';
import FindOneValidationPipe from 'src/api/shared/pipes/filters/find-one-validation.pipe';
import FindManyValidationPipe from 'src/api/shared/pipes/filters/find-many-validation.pipe';

@Controller({ path: '/roles' })
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  static validProperties = ['id', 'name'];

  @Get()
  @UsePipes(
    new FindManyValidationPipe(RolesController.validProperties, Role.relations),
  )
  getRoles(@Query() options: FindManyOptionsDTO<Role>) {
    return this.rolesService.findAll(options);
  }

  @Get(':id')
  @UsePipes(
    new FindOneValidationPipe(RolesController.validProperties, Role.relations),
  )
  getRole(
    @Param('id', ParseIntPipe) id: number,
    @Query() options: FindOneOptionsDTO<Role>,
  ): Promise<Role> {
    return this.rolesService.findOne(id, options);
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
