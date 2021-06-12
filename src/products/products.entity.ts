import { Category } from 'src/categories/categories.entity';
import { Favorite } from 'src/favorite/favorite.entity';
import { Highlight } from 'src/highlights/highlights.entity';
import { OrderProduct } from 'src/order/order-product/order-product.entity';
import EntityParent from 'src/shared/models/entity-parent.model';
import { User } from 'src/users/users.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity()
export class Product extends EntityParent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ type: 'float' })
  price: number;

  @Column({ default: null, type: 'float' })
  rating: number;

  @OneToMany((type) => Highlight, (highlight) => highlight.product)
  highlights: Highlight[];

  @OneToMany((type) => Favorite, (favorite) => favorite.product)
  favorites: Favorite[];

  @ManyToOne((type) => Category)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @ManyToOne((type) => User, (user) => user.products)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany((type) => OrderProduct, (op) => op.product)
  orderProducts: OrderProduct[];

  @Column({ default: 1 })
  stock: number;

  @Column()
  img: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  static relations = [
    'highlights',
    'category',
    'user',
    'orderProducts',
    'favorites',
  ];

  toResponseObject() {
    const obj = {
      id: this.id,
      title: this.title,
      code: this.code,
      description: this.description,
      rating: this.rating,
      price: this.price,
      stock: this.stock,
      img: this.img,
      updatedAt: this.updatedAt,
      createdAt: this.createdAt,
    };
    if (this.user) {
      obj['user'] = this.user.toResponseObject();
    }
    if (this.highlights) {
      obj['highlights'] = this.highlights.map((h) => h.toResponseObject());
    }
    if (this.category) {
      obj['category'] = this.category.toResponseObject();
    }
    if (this.orderProducts) {
      obj['orderProducts'] = this.orderProducts.map((op) =>
        op.toResponseObject(),
      );
    }
    if (this.favorites) {
      obj['favorites'] = this.favorites.map((f) => f.toResponseObject());
    }
    return obj;
  }
}
