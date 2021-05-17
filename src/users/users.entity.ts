import { Product } from 'src/products/products.entity';
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
} from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  dateOfBirth: Date;

  @OneToMany((type) => Product, (product) => product.user)
  products: Product[];

  @ManyToMany((type) => Role, (role) => role.users)
  @JoinTable({ name: 'user_role' })
  roles: Role[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: string;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: string;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    const salt = 8;
    this.password = await bcrypt.hash(this.password, salt);
  }
}
