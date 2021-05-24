import { Product } from 'src/products/products.entity';
import { Address } from 'src/address/address.entity';
import { Role } from 'src/roles/roles.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
  BeforeInsert,
  BeforeUpdate,
  DeleteDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Order } from 'src/order/order.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ name: 'date_of_birth' })
  dateOfBirth: Date;

  @OneToMany((type) => Product, (product) => product.user)
  products: Product[];

  @OneToMany((type) => Order, (order) => order.user)
  orders: Order[];

  @OneToMany((type) => Address, (address) => address.user)
  addresses: Address[];

  @ManyToMany((type) => Role, (role) => role.users)
  @JoinTable({
    name: 'user_role',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
  })
  roles: Role[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: string;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: string;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: string;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    const salt = 8;
    if (this.password) this.password = await bcrypt.hash(this.password, salt);
  }

  static relations = ['roles', 'products', 'orders', 'addresses'];

  toResponseObject(): any {
    const obj = {
      id: this.id,
      username: this.username,
      firstName: this.firstName,
      lastName: this.lastName,
      updatedAt: this.updatedAt,
      createdAt: this.createdAt,
    };
    if (this.products) {
      obj['products'] = this.products.map((p) => p.toResponseObject());
    }
    if (this.roles) {
      obj['roles'] = this.roles.map((r) => r.toResponseObject());
    }
    if (this.orders) {
      obj['orders'] = this.orders.map((o) => o.toResponseObject());
    }
    if (this.addresses) {
      obj['addresses'] = this.addresses.map((a) => a.toResponseObject());
    }
    return obj;
  }
}
