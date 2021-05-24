import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from 'src/users/users.entity';
import { OrderProduct } from 'src/order-product/order-product.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  address: string;

  @ManyToOne((type) => User, (user) => user.orders)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;

  @OneToMany((type) => OrderProduct, (op) => op.order)
  orderProducts: OrderProduct[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: string;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: string;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: string;

  static relations = ['user'];

  toResponseObject(): any {
    const obj = {
      id: this.id,
      username: this.user.username,
      address: this.address,
    };
    if (this.user) {
      obj['user'] = this.user.toResponseObject();
    }
    if (this.orderProducts) {
      obj['orderProducts'] = this.orderProducts.map((op) =>
        op.toResponseObject(),
      );
    }
    return obj;
  }
}
