import EntityParent from 'src/api/shared/models/entity-parent.model';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity()
export class Category extends EntityParent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @ManyToOne((type) => Category, (category) => category.childCategories)
  @JoinColumn({ name: 'parent_category_id' })
  parentCategory: Category;

  @OneToMany((type) => Category, (category) => category.parentCategory)
  childCategories: Category[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  static relations = ['parentCategory', 'childCategories'];

  toResponseObject() {
    const obj = { id: this.id, name: this.name };
    if (this.parentCategory) {
      obj['parentCategory'] = this.parentCategory;
    }
    if (this.childCategories) {
      obj['childCategories'] = this.childCategories;
    }
    return obj;
  }
}
