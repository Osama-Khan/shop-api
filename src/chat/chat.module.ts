import { Module } from '@nestjs/common';
import { EventModule } from './event/event.module';
import { ConnectionModule } from './repository/connection/connection.module';
import { MessageModule } from './repository/message/message.module';

@Module({
  imports: [ConnectionModule, MessageModule, EventModule],
})
export class ChatModule {}
