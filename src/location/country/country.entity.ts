import EntityParent from 'src/shared/models/entity-parent.model';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { State } from '../state/state.entity';

@Entity()
export class Country extends EntityParent {
  @PrimaryColumn()
  id: number;

  @OneToMany((type) => State, (state) => state.country)
  states: State[];

  @Column()
  iso2: string;

  @Column()
  iso3: string;

  @Column({ name: 'phone_code' })
  phoneCode: number;

  @Column()
  capital: string;

  @Column()
  currency: string;

  @Column({ nullable: true })
  native: string;

  @Column({ nullable: true })
  region: string;

  @Column({ name: 'sub_region', nullable: true })
  subRegion: string;

  @Column({ nullable: true })
  emoji: string;

  @Column({ nullable: true })
  emojiU: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  static relations = ['states'];
}
