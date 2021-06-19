import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorite } from './favorite.entity';
import { ApiService } from 'src/shared/services/api.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from 'src/users/users.entity';
import { Product } from 'src/products/products.entity';

@Injectable()
export class FavoriteService extends ApiService<Favorite> {
  constructor(
    @InjectRepository(Favorite)
    favoriteRepository: Repository<Favorite>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {
    super(favoriteRepository, Favorite.relations);
  }

  verifyProductExists = (id) => this.productRepository.findOne(id);
  verifyUserExists = (id) => this.userRepository.findOne(id);

  /**
   * Gets count of users who have favorited a product
   * @param id ID of the product
   * @returns count of favorites
   */
  async getProductFavoriteCount(id: number) {
    const p = await this.verifyProductExists(id);
    if (!p) {
      throw new NotFoundException('No such Product');
    }
    const count = await super.count({ where: { product: id } });
    return { count };
  }

  /**
   * Gets count of products that have been favorited by given user
   * @param id ID of the user
   * @returns count of favorites
   */
  async getUserFavoriteCount(id: number) {
    const u = await this.verifyUserExists(id);
    if (!u) {
      throw new NotFoundException('No such User');
    }
    const count = await super.count({ where: { user: id } });
    return { count };
  }

  async insert(favorite) {
    const prev = await this.findAll({
      where: {
        user: favorite.user,
        product: favorite.product,
      },
    });
    if (prev.length > 0) {
      throw new BadRequestException('Product already favorited by user');
    }
    if (!(await this.verifyProductExists(favorite.product))) {
      throw new BadRequestException('Product does not exist');
    }
    if (!(await this.verifyUserExists(favorite.user))) {
      throw new BadRequestException('User does not exist');
    }
    return super.insert(favorite);
  }
}
