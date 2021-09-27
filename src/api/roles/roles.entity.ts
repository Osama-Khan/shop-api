import { Permission } from 'src/api/permissions/permissions.entity';
import EntityParent from 'src/api/shared/models/entity-parent.model';
import { User } from 'src/api/users/users.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  DeleteDateColumn,
} from 'typeorm';

@Entity()
export class Role extends EntityParent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false })
  name: string;

  @ManyToMany((type) => Permission, (permission) => permission.roles)
  @JoinTable({
    name: 'role_permission',
    joinColumn: { name: 'role_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'permission_id', referencedColumnName: 'id' },
  })
  permissions: Permission[];

  @ManyToMany((type) => User, (user) => user.roles)
  users: User[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  static relations = ['users', 'permissions'];

  toResponseObject() {
    const obj = {
      id: this.id,
      name: this.name,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
    if (this.users) {
      obj['users'] = this.users.map((u) => u.toResponseObject());
    }
    if (this.permissions) {
      obj['permissions'] = this.permissions.map((p) => p.toResponseObject());
    }
    return obj;
  }
}
