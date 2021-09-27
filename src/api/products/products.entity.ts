import { Category } from 'src/api/categories/categories.entity';
import { Favorite } from 'src/api/favorite/favorite.entity';
import { Highlight } from 'src/api/highlights/highlights.entity';
import { OrderProduct } from 'src/api/order/order-product/order-product.entity';
import EntityParent from 'src/api/shared/models/entity-parent.model';
import { User } from 'src/api/users/users.entity';
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
import { ProductImage } from './product-image/product-image.entity';
import { ProductRating } from './product-rating/product-rating.entity';

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

  @OneToMany((type) => ProductRating, (pr) => pr.product)
  ratings: ProductRating[];

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

  @OneToMany((type) => ProductImage, (pi) => pi.product)
  images: ProductImage[];

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
    'ratings',
    'images',
  ];

  toResponseObject() {
    const obj = {
      id: this.id,
      title: this.title,
      code: this.code,
      description: this.description,
      price: this.price,
      stock: this.stock,
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
    if (this.ratings) {
      obj['ratings'] = this.ratings.map((r) => r.toResponseObject());
    }
    if (this.images) {
      obj['images'] = this.images.map((r) => r.toResponseObject());
    }
    if (this.favorites) {
      obj['favorites'] = this.favorites.map((f) => f.toResponseObject());
    }
    return obj;
  }
}
