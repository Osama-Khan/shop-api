import { Product } from 'src/api/products/products.entity';
import EntityParent from 'src/api/shared/models/entity-parent.model';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity()
export class Highlight extends EntityParent {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => Product, (product) => product.highlights)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column()
  highlight: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  static relations = ['product'];

  toResponseObject() {
    const { id, highlight } = this;
    if (this.product) {
      return { id, highlight, product: this.product.toResponseObject() };
    }
    return { id, highlight };
  }
}
