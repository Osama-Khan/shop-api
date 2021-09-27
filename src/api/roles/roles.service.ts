import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiService } from 'src/api/shared/services/api.service';
import { Repository } from 'typeorm';
import { Role } from './roles.entity';

@Injectable()
export class RolesService extends ApiService<Role> {
  constructor(
    @InjectRepository(Role)
    rolesRepository: Repository<Role>,
  ) {
    super(rolesRepository, Role.relations);
  }
}
