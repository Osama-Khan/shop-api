import { User } from 'src/api/users/users.entity';
import EntityParent from 'src/shared/models/entity-parent.model';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Thread } from '../thread/thread.entity';

@Entity()
export class Message extends EntityParent {
  /** ID of the message */
  @PrimaryGeneratedColumn()
  id: number;

  /** Content of the message */
  @Column()
  message: string;

  /** Thread the message belongs to */
  @ManyToOne((type) => Thread, (thread) => thread.messages)
  @JoinColumn({ name: 'thread_id' })
  thread: Thread;

  /** User that sent the message */
  @ManyToOne((type) => User)
  @JoinColumn({ name: 'sender_id' })
  sender: User;

  /** Time the message was seen at */
  @Column({ type: 'date', name: 'seen_at', nullable: true })
  seenAt?: Date;

  /** Time the message was sent at */
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  static relations = ['sender', 'thread'];

  toResponseObject() {
    const obj = {
      id: this.id,
      message: this.message,
      seenAt: this.seenAt,
      createdAt: this.createdAt,
    };
    if (this.sender) {
      obj['sender'] = this.sender.toResponseObject();
    }
    if (this.thread) {
      obj['thread'] = this.thread.toResponseObject();
    }
    return obj;
  }
}
