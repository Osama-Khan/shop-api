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
  @JoinColumn({ name: 'to_id' })
  to: User;

  /** User that received the message */
  @ManyToOne((type) => User)
  @JoinColumn({ name: 'from_id' })
  from: User;

  /** Time the message was sent at */
  @CreateDateColumn()
  createdAt: Date;

  static relations = ['to', 'from'];
}
