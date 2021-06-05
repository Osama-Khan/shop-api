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
  OneToOne,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Order } from 'src/order/order.entity';
import EntityParent from 'src/shared/models/entity-parent.model';
import { Setting } from 'src/setting/setting.entity';

@Entity()
export class User extends EntityParent {
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

  @Column({ name: 'profile_image', type: 'text' })
  profileImage: string;

  @ManyToMany((type) => Role, (role) => role.users)
  @JoinTable({
    name: 'user_role',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
  })
  roles: Role[];

  @OneToOne((type) => Setting, (setting) => setting.user)
  setting: Setting;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    const salt = 8;
    if (this.password) this.password = await bcrypt.hash(this.password, salt);
  }

  @BeforeInsert()
  @BeforeUpdate()
  setDefaultImage() {
    if (!this.profileImage)
      this.profileImage = `${process.env.DOMAIN}/images/profile/default-profile.png`;
  }

  static relations = ['roles', 'products', 'orders', 'addresses', 'setting'];

  toResponseObject() {
    const obj = {
      id: this.id,
      username: this.username,
      firstName: this.firstName,
      lastName: this.lastName,
      profileImage: this.profileImage,
      dateOfBirth: this.dateOfBirth,
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
      // Does not work with map for some reason
      obj['addresses'] = this.addresses; //.map((a) => a.toResponseObject());
    }
    if (this.setting) {
      obj['setting'] = this.setting.toResponseObject();
    }
    return obj;
  }
}
