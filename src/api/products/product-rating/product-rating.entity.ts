import EntityParent from 'src/api/shared/models/entity-parent.model';
import { User } from 'src/api/users/users.entity';
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
import { Product } from '../products.entity';

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

  @ManyToOne((type) => Product, (product) => product.ratings)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne((type) => User, (user) => user.ratings)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  static relations = ['product', 'user'];
}
