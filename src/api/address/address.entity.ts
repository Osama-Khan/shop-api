import { City } from 'src/api/location/city/city.entity';
import EntityParent from 'src/api/shared/models/entity-parent.model';
import { User } from 'src/api/users/users.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity()
export class Address extends EntityParent {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => User, (user) => user.addresses)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne((type) => City)
  @JoinColumn({ name: 'city_id' })
  city: City;

  @Column()
  tag: string;

  @Column()
  address: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  static relations = ['user', 'city'];
}
