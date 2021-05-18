import { Product } from 'src/products/products.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Highlight {
  @PrimaryGeneratedColumn({ name: 'highlight_id' })
  hId: number;

  @ManyToOne((type) => Product, (product) => product.highlights)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column()
  highlight: string;
}
