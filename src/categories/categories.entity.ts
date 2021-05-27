import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @OneToOne((type) => Category)
  @JoinColumn({ name: 'parent_category_id' })
  parentCategory: Category;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  static relations = ['parentCategory'];

  toResponseObject(): any {
    const { id, name } = this;
    if (this.parentCategory) {
      return {
        id,
        name,
        parentCategory: this.parentCategory.toResponseObject(),
      };
    }
    return { id, name };
  }
}
