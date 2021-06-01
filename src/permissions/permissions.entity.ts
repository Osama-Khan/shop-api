import { Role } from 'src/roles/roles.entity';
import EntityParent from 'src/shared/models/entity-parent.model';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  DeleteDateColumn,
} from 'typeorm';

@Entity()
export class Permission extends EntityParent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @ManyToMany((type) => Role, (role) => role.permissions)
  roles: Role[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  static relations = ['roles'];

  toResponseObject = (): any => {
    const { id, name, updatedAt, createdAt } = this;
    const obj = { id, name, updatedAt, createdAt };
    if (this.roles) {
      obj['roles'] = this.roles.map((r) => r.toResponseObject());
    }
    return obj;
  };
}
