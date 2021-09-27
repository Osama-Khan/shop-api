import EntityParent from 'src/api/shared/models/entity-parent.model';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Product } from '../products.entity';

@Entity()
export class ProductImage extends EntityParent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  image: string;

  @ManyToOne((type) => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  static relations = ['product'];
}
