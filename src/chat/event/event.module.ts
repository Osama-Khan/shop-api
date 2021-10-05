import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from '../repository/message/message.entity';
import { Thread } from '../repository/thread/thread.entity';
import { EventService } from './event.service';

@Module({
  imports: [TypeOrmModule.forFeature([Message, Thread])],
  providers: [EventService],
})
export class EventModule {}
