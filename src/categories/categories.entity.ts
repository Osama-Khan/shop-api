import { Product } from 'src/products/products.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, PrimaryColumn, CreateDateColumn, UpdateDateColumn, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(type => Category)
  child_categories: Category[];

  @CreateDateColumn()
  created_at: string;

  @UpdateDateColumn()
  updated_at: string;
}