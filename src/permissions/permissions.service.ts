import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiService } from 'src/shared/services/api.service';
import { Repository } from 'typeorm';
import { PermissionDTO } from './permissions.dto';
import { Permission } from './permissions.entity';

@Injectable()
export class PermissionsService extends ApiService<Permission> {
  constructor(
    @InjectRepository(Permission)
    permissionsRepository: Repository<Permission>,
  ) {
    super(
      permissionsRepository,
      PermissionDTO.generateRO,
      Permission.relations,
    );
  }
}
