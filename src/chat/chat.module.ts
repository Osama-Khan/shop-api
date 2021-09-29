import { Module } from '@nestjs/common';
import { EventModule } from './event/event.module';
import { MessageModule } from './repository/message/message.module';
import { ThreadModule } from './repository/thread/thread.module';

@Module({
  imports: [ThreadModule, MessageModule, EventModule],
})
export class ChatModule {}
