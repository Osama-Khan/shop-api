import { Module } from '@nestjs/common';
import { ConnectionModule } from './repository/connection/connection.module';
import { MessageModule } from './repository/message/message.module';

@Module({
  imports: [ConnectionModule, MessageModule],
})
export class ChatModule {}
