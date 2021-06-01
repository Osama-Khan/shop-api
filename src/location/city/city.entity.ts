import EntityParent from 'src/shared/models/entity-parent.model';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { State } from '../state/state.entity';

@Entity()
export class City extends EntityParent {
  @PrimaryColumn()
  id: number;

  @ManyToOne((type) => State, (state) => state.cities)
  @JoinColumn({ name: 'state_id' })
  state: State;

  @Column()
  latitude: number;

  @Column()
  longitude: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  static relations = ['state'];
}
