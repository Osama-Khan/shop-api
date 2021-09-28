import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from '../connection/connection.entity';
import { ConnectionService } from './connection.service';

@Module({
  imports: [TypeOrmModule.forFeature([Connection])],
  providers: [ConnectionService],
})
export class ConnectionModule {}
