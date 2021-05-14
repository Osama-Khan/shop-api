import { Category } from 'src/categories/categories.entity';
import { Highlight } from 'src/highlights/highlights.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, PrimaryColumn, OneToMany, CreateDateColumn, UpdateDateColumn, JoinColumn, ManyToOne } from 'typeorm';

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
  
  @OneToMany(type => Highlight, highlight => highlight.product)
  highlights: Highlight[];
  
  @ManyToOne(type => Category)
  category: Category;

  @Column({default: 1})
  stock: number;

  @Column()
  img: string;
  
  @CreateDateColumn({name: "created_at"})
  createdAt: string;

  @UpdateDateColumn({name: "updated_at"})
  updatedAt: string;
}