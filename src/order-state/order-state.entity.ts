import { Order } from 'src/order/order.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class OrderState {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  state: 'Processing' | 'Shipped' | 'Delivered' | 'Canceled';

  @OneToMany((type) => Order, (order) => order.orderState)
  orders: Order[];

  static relations = ['orders'];

  toResponseObject() {
    return this;
  }
}
