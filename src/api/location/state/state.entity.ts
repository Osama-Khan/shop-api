import EntityParent from 'src/shared/models/entity-parent.model';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { City } from '../city/city.entity';
import { Country } from '../country/country.entity';

@Entity()
export class State extends EntityParent {
  @PrimaryColumn()
  id: number;

  @ManyToOne((type) => Country, (country) => country.states)
  @JoinColumn({ name: 'country_id' })
  country: Country;

  @OneToMany((type) => City, (city) => city.state)
  cities: City[];

  @Column()
  name: string;

  @Column({ name: 'state_code', nullable: true })
  stateCode: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  static relations = ['country', 'cities'];
}
