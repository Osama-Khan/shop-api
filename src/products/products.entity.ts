import { Category } from 'src/categories/categories.entity';
import { Highlight } from 'src/highlights/highlights.entity';
import { User } from 'src/users/users.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  price: number;

  @Column({ default: null })
  rating: number;

  @OneToMany((type) => Highlight, (highlight) => highlight.product)
  highlights: Highlight[];

  @ManyToOne((type) => Category)
  category: Category;

  @ManyToOne((type) => User, (user) => user.products)
  user: User;

  @Column({ default: 1 })
  stock: number;

  @Column()
  img: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: string;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: string;
}
