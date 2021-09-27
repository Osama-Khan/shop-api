import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UsePipes,
} from '@nestjs/common';
import FindManyOptionsDTO from 'src/api/shared/models/find-many-options.dto';
import FindOneOptionsDTO from 'src/api/shared/models/find-one-options.dto';
import FindManyValidationPipe from 'src/api/shared/pipes/filters/find-many-validation.pipe';
import FindOneValidationPipe from 'src/api/shared/pipes/filters/find-one-validation.pipe';
import { Permission } from './permissions.entity';
import { PermissionsService } from './permissions.service';

@Controller({ path: '/permissions' })
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  static validProperties = ['id', 'name'];

  @Get()
  @UsePipes(
    new FindManyValidationPipe(
      PermissionsController.validProperties,
      Permission.relations,
    ),
  )
  getPermissions(@Query() options: FindManyOptionsDTO<Permission>) {
    return this.permissionsService.findAll(options);
  }

  @Get(':id')
  @UsePipes(
    new FindOneValidationPipe(
      PermissionsController.validProperties,
      Permission.relations,
    ),
  )
  getPermission(
    @Param('id', ParseIntPipe) id: number,
    @Query() options: FindOneOptionsDTO<Permission>,
  ): Promise<Permission> {
    return this.permissionsService.findOne(id, options);
  }
}
