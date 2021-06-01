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

  @OneToOne((type) => Category, (category) => category.childCategory)
  @JoinColumn({ name: 'parent_category_id' })
  parentCategory: Category;

  @OneToOne((type) => Category, (category) => category.parentCategory)
  childCategory: Category;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  static relations = ['parentCategory', 'childCategory'];

  toResponseObject(): any {
    const obj = { id: this.id, name: this.name };
    if (this.parentCategory) {
      obj['parentCategory'] = this.parentCategory;
    }
    if (this.childCategory) {
      obj['childCategory'] = this.childCategory;
    }
    return obj;
  };
}
