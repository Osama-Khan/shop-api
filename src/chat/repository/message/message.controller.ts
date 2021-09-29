import { Controller, Get, Query, UsePipes } from '@nestjs/common';
import FindManyValidationPipe from 'src/shared/pipes/filters/find-many-validation.pipe';
import FindManyOptionsDTO from 'src/shared/models/find-many-options.dto';
import { Message } from './message.entity';
import { MessageService } from './message.service';

@Controller({ path: '/messages' })
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  static validProperties = ['id', 'to', 'from', 'message', 'time'];

  @Get()
  @UsePipes(
    new FindManyValidationPipe(
      MessageController.validProperties,
      Message.relations,
    ),
  )
  getMessages(@Query() options: FindManyOptionsDTO<Message>) {
    return this.messageService.findAll(options);
  }
}
