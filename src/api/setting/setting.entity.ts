import { Address } from 'src/api/address/address.entity';
import EntityParent from 'src/api/shared/models/entity-parent.model';
import { User } from 'src/api/users/users.entity';
import {
  Entity,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToOne,
  PrimaryColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';

@Entity()
export class Setting extends EntityParent {
  @PrimaryColumn()
  id: number;

  @OneToOne((type) => User, (user) => user.setting)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToOne((type) => Address)
  @JoinColumn({ name: 'default_address_id' })
  defaultAddress: Address;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  static relations = ['user', 'defaultAddress'];

  @BeforeInsert()
  @BeforeUpdate()
  syncIdWithUser() {
    if (this.user) {
      this.id = this.user.id;
    }
  }

  toResponseObject() {
    const obj = {
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
    if (this.user) {
      obj['user'] = this.user.toResponseObject();
    }
    if (this.defaultAddress) {
      obj['defaultAddress'] = this.defaultAddress.toResponseObject();
    }
    return obj;
  }
}
