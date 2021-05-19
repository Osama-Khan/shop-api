import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiService } from 'src/shared/services/api.service';
import { Repository } from 'typeorm';
import { RoleDTO } from './roles.dto';
import { Role } from './roles.entity';

@Injectable()
export class RolesService extends ApiService<Role> {
  constructor(
    @InjectRepository(Role)
    rolesRepository: Repository<Role>,
  ) {
    super(rolesRepository, RoleDTO.generateRO, Role.relations);
  }
}
