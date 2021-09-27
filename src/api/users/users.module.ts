import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './users.entity';
import { Role } from 'src/api/roles/roles.entity';
import { Address } from 'src/api/address/address.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, Address])],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
