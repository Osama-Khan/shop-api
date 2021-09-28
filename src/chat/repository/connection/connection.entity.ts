import { User } from 'src/api/users/users.entity';
import EntityParent from 'src/shared/models/entity-parent.model';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Connection extends EntityParent {
  /** ID of the connection */
  @PrimaryGeneratedColumn()
  id: number;

  /** Connected user */
  @OneToOne((type) => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  /** The socket the user is connected to */
  @Column({ unique: true, name: 'socket' })
  socket: string;

  static relations = ['user'];
}
