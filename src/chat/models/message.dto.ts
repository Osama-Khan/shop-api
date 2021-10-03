import { User } from 'src/api/users/users.entity';
import { Thread } from '../repository/thread/thread.entity';

interface IMessageDTO {
  /** ID of the message */
  id: number;

  /** Content of the message */
  message: string;

  /** Thread the message belongs to */
  thread: Pick<Thread, 'id'>;

  /** User that sent the message */
  sender: Pick<User, 'id'>;

  /** Time the message was sent at */
  createdAt: Date;
}

/** DTO for the message object sent to the client */
export default class MessageDTO implements IMessageDTO {
  id: number;
  message: string;
  thread: Pick<Thread, 'id'>;
  sender: Pick<User, 'id'>;
  createdAt: Date;

  constructor(message: IMessageDTO) {
    this.id = message.id;
    this.message = message.message;
    this.thread = message.thread;
    this.sender = message.sender;
    this.createdAt = message.createdAt;
  }
}
