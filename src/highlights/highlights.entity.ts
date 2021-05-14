import { Product } from 'src/products/products.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class Highlight {
  @PrimaryGeneratedColumn()
  h_id: number;

  @ManyToOne(type => Product, product => product.highlights)
  product: Product;

  @Column()
  highlight: string;
}