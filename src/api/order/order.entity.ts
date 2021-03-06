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
import { User } from 'src/api/users/users.entity';
import { OrderProduct } from 'src/api/order/order-product/order-product.entity';
import { OrderState } from 'src/api/order/order-state/order-state.entity';
import EntityParent from 'src/shared/models/entity-parent.model';

@Entity()
export class Order extends EntityParent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  address: string;

  @ManyToOne((type) => User, (user) => user.orders)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;

  @OneToMany((type) => OrderProduct, (op) => op.order)
  orderProducts: OrderProduct[];

  @ManyToOne((type) => OrderState, (os) => os.orders)
  @JoinColumn({ name: 'state_id' })
  orderState: OrderState;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  static relations = ['user', 'orderProducts', 'orderState'];

  toResponseObject() {
    const obj = {
      id: this.id,
      address: this.address,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
    if (this.user) {
      obj['user'] = this.user.toResponseObject();
    }
    if (this.orderProducts) {
      obj['orderProducts'] = this.orderProducts.map((op) =>
        op.toResponseObject(),
      );
    }
    if (this.orderState) {
      obj['orderState'] = this.orderState.toResponseObject();
    }
    return obj;
  }
}
