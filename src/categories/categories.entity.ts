import { Product } from 'src/products/products.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, PrimaryColumn, CreateDateColumn, UpdateDateColumn, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(type => Category)
  childCategories: Category[];

  @CreateDateColumn({name: "created_at"})
  createdAt: string;

  @UpdateDateColumn({name: "updated_at"})
  updatedAt: string;
}