import { User } from 'src/api/users/users.entity';
import EntityParent from 'src/shared/models/entity-parent.model';
import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Message } from '../message/message.entity';

@Entity()
export class Thread extends EntityParent {
  /** ID of the thread */
  @PrimaryGeneratedColumn()
  id: number;

  /** Messages in the thread */
  @OneToMany((type) => Message, (message) => message.thread)
  messages: Message[];

  /** User that received the thread */
  @ManyToOne((type) => User)
  @JoinColumn({ name: 'to_id' })
  to: User;

  /** User that started the thread by sending the first message */
  @ManyToOne((type) => User)
  @JoinColumn({ name: 'from_id' })
  from: User;

  /** Time the thread was created at */
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  /** Time of the last update to the thread */
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  static relations = ['to', 'from', 'messages'];

  toResponseObject() {
    const obj = {
      id: this.id,
      updatedAt: this.updatedAt,
      createdAt: this.createdAt,
    };
    if (this.messages) {
      obj['messages'] = this.messages.map((m) => m.toResponseObject());
    }
    if (this.to) {
      obj['to'] = this.to.toResponseObject();
    }
    if (this.from) {
      obj['from'] = this.from.toResponseObject();
    }
    return obj;
  }
}
