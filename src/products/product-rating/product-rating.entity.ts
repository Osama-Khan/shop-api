import EntityParent from 'src/shared/models/entity-parent.model';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  DeleteDateColumn,
  JoinColumn,
} from 'typeorm';

@Entity()
export class ProductRating extends EntityParent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  stars: number;

  @Column()
  title: string;

  @Column()
  description: string;


  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

}
