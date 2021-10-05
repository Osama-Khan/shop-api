import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Put,
  Query,
  UsePipes,
} from '@nestjs/common';
import FindManyOptionsDTO from 'src/shared/models/find-many-options.dto';
import FindOneOptionsDTO from 'src/shared/models/find-one-options.dto';
import FindManyValidationPipe from 'src/shared/pipes/filters/find-many-validation.pipe';
import FindOneValidationPipe from 'src/shared/pipes/filters/find-one-validation.pipe';
import { Thread } from './thread.entity';
import { ThreadService } from './thread.service';

@Controller({ path: '/threads' })
export class ThreadController {
  constructor(private readonly threadService: ThreadService) {}

  static validProperties = ['id', 'to', 'from', 'createdAt', 'updatedAt'];

  @Get()
  @UsePipes(
    new FindManyValidationPipe(
      ThreadController.validProperties,
      Thread.relations,
    ),
  )
  getThreads(@Query() options: FindManyOptionsDTO<Thread>) {
    return this.threadService.findAll(options);
  }

  @Get(':id')
  @UsePipes(
    new FindOneValidationPipe(
      ThreadController.validProperties,
      Thread.relations,
    ),
  )
  getThread(
    @Param('id', ParseIntPipe) id: number,
    @Query() options: FindOneOptionsDTO<Thread>,
  ) {
    return this.threadService.findOne(id, options);
  }

  @Get('user/:id')
  getThreadsOf(
    @Param('id', ParseIntPipe) id: number,
    @Query(
      new FindManyValidationPipe(
        ThreadController.validProperties,
        Thread.relations,
      ),
    )
    options: FindManyOptionsDTO<Thread>,
  ) {
    return this.threadService.getThreadsOf(id, options);
  }

  @Put()
  startThread(@Body() data: { thread: Thread; message: string }) {
    return this.threadService.startThread(data.thread, data.message);
  }
}
