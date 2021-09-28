import { Order } from 'src/api/order/order.entity';
import { Product } from 'src/api/products/products.entity';
import EntityParent from 'src/shared/models/entity-parent.model';
import {
  Entity,
  Column,
  JoinColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';

@Entity()
export class OrderProduct extends EntityParent {
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne((type) => Product, (product) => product.orderProducts)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne((type) => Order, (order) => order.orderProducts)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column()
  quantity: number;

  @Column()
  price: number;

  static relations = ['product', 'order'];
}
