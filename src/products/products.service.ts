import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { Product } from './products.entity';
import { ApiService } from 'src/shared/services/api.service';
import { Highlight } from 'src/highlights/highlights.entity';
import { Favorite } from 'src/favorite/favorite.entity';
import FindManyOptionsDTO from 'src/shared/models/find-many-options.dto';
import withFavoriteCount from 'src/shared/helpers/favorite-count.helper';

@Injectable()
export class ProductsService extends ApiService<Product> {
  constructor(
    @InjectRepository(Product)
    productRepository: Repository<Product>,
    @InjectRepository(Highlight)
    private highlightsRepository: Repository<Highlight>,
    @InjectRepository(Favorite)
    private favoritesRepository: Repository<Favorite>,
  ) {
    super(productRepository, Product.relations, [
      'highlights',
      'category',
      'user',
    ]);
  }

  async findAll(options: FindManyOptionsDTO<Product>) {
    const { data, meta } = await super.findAll(options);

    const prods = await withFavoriteCount(data, this.favoritesRepository);
    return { data: prods, meta };
  }

  async findOne(id: number, options?: FindOneOptions<Product>) {
    if (options?.relations?.includes('favorites')) {
      return await super.findOne(id, options);
    }

    // Adding count of favorites
    const relations = options?.relations?.filter((r) => r !== 'favorites');
    const prod: any = await super.findOne(id, { relations });
    prod.favoriteCount = await this.favoritesRepository.count({
      where: { product: id },
    });
    return prod;
  }

  // Inserts highlights into database before product insertion
  async insert(p: any): Promise<Product> {
    const product = await super.insert(p);
    p.highlights.forEach(async (h: string) => {
      const hObj = new Highlight();
      hObj.highlight = h;
      hObj.product = product;
      const highlight = this.highlightsRepository.create(hObj);
      await this.highlightsRepository.insert(highlight);
    });
    product.highlights = p.highlights;
    return product;
  }
}
