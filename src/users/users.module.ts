import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './users.entity';
import { Product } from 'src/products/products.entity';
import { Role } from 'src/roles/roles.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Product, Role])],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
