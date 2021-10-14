import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from 'src/api/address/address.entity';
import { Role } from 'src/api/roles/roles.entity';
import { User } from 'src/api/users/users.entity';
import { UsersService } from 'src/api/users/users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, Address]),
  ],
  providers: [UsersService],
})
export class UserSeederModule {}
