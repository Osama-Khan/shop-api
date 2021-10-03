import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import FindManyOptionsDTO from 'src/shared/models/find-many-options.dto';
import { ApiService } from 'src/shared/services/api.service';
import { Repository } from 'typeorm';
import { Message } from '../message/message.entity';
import { Thread } from './thread.entity';

@Injectable()
export class ThreadService extends ApiService<Thread> {
  constructor(
    @InjectRepository(Thread)
    threadRepository: Repository<Thread>,
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
  ) {
    super(threadRepository, Thread.relations);
  }

  /** Gets threads where the given user is a participant. If messages are not requested, returns
   * `latestMessage` with the latest message in the thread instead of `messages` array
   */
  async getThreadsOf(id: number, options: FindManyOptionsDTO<Thread>) {
    const where = [{ from: id }, { to: id }];
    if (options?.relations?.includes('messages')) {
      return this.findAll({ ...options, where });
    }
    const threads = await this.findAll({ ...options, where });
    threads.data = await Promise.all(
      threads.data.map(async (t) => {
        t.latestMessage = await this.messageRepository.findOne({
          relations: ['sender'],
          where: { thread: t.id },
          order: { createdAt: 'DESC' },
        });
        return t;
      }),
    );
    return threads;
  }
}
