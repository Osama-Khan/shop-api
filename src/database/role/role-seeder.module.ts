import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from 'src/api/roles/roles.entity';
import { RolesService } from 'src/api/roles/roles.service';

@Module({
  imports: [TypeOrmModule.forFeature([Role])],
  providers: [RolesService],
})
export class RoleSeederModule {}
