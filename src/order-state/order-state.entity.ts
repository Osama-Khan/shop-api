import { Order } from 'src/order/order.entity';
import EntityParent from 'src/shared/models/entity-parent.model';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class OrderState extends EntityParent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  state: 'Processing' | 'Shipped' | 'Delivered' | 'Canceled';

  @OneToMany((type) => Order, (order) => order.orderState)
  orders: Order[];

  static relations = ['orders'];
}
