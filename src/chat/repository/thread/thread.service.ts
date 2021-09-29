import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import FindManyOptionsDTO from 'src/shared/models/find-many-options.dto';
import { ApiService } from 'src/shared/services/api.service';
import { Repository } from 'typeorm';
import { Thread } from './thread.entity';

@Injectable()
export class ThreadService extends ApiService<Thread> {
  constructor(
    @InjectRepository(Thread)
    threadRepository: Repository<Thread>,
  ) {
    super(threadRepository, Thread.relations);
  }

  /** Gets threads where the given user is a participant */
  getThreadsOf(id: number, options: FindManyOptionsDTO<Thread>) {
    return this.findAll({ ...options, where: [{ from: id }, { to: id }] });
  }
}
