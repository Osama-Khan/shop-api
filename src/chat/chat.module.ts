import { Module } from '@nestjs/common';
import { EventModule } from './event/event.module';
import { MessageModule } from './repository/message/message.module';

@Module({
  imports: [MessageModule, EventModule],
})
export class ChatModule {}
