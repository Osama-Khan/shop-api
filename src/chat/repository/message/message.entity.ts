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

@Entity()
export class Message extends EntityParent {
  /** ID of the message */
  @PrimaryGeneratedColumn()
  id: number;

  /** Content of the message */
  @Column()
  message: string;

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

  static relations = ['sender'];

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
    return obj;
  }
}
