import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiService } from 'src/shared/services/api.service';
import { Repository } from 'typeorm';
import { Message } from './message.entity';

@Injectable()
export class MessageService extends ApiService<Message> {
  constructor(
    @InjectRepository(Message)
    messageRepository: Repository<Message>,
  ) {
    super(messageRepository, Message.relations);
  }
}
