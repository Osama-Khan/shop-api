import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from '../repository/connection/connection.entity';
import { Message } from '../repository/message/message.entity';
import { EventService } from './event.service';

@Module({
  imports: [TypeOrmModule.forFeature([Connection, Message])],
  providers: [EventService],
})
export class EventModule {}
