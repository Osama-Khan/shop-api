import { Order } from 'src/order/order.entity';
import { Product } from 'src/products/products.entity';
import {
  Entity,
  Column,
  JoinColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';

@Entity()
export class OrderProduct {
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

  static relations = ['product'];

  toResponseObject(): any {
    return {
      id: this.id,
      product: this.product,
      order: this.order,
      quantity: this.quantity,
      price: this.price,
    };
  }
}
