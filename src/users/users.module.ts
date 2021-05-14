import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './users.entity';
import { Product } from 'src/products/products.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Product])],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
