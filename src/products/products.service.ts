import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, ObjectLiteral, Repository } from 'typeorm';
import { Product } from './products.entity';
import { ApiService } from 'src/shared/services/api.service';
import { Highlight } from 'src/highlights/highlights.entity';
import { Favorite } from 'src/favorite/favorite.entity';

@Injectable()
export class ProductsService extends ApiService<Product> {
  constructor(
    @InjectRepository(Product)
    productsRepository: Repository<Product>,
    @InjectRepository(Highlight)
    private highlightsRepository: Repository<Highlight>,
    @InjectRepository(Favorite)
    private favoritesRepository: Repository<Favorite>,
  ) {
    super(productsRepository, Product.relations);
  }

  async findAll(
    take?: number,
    relations?: any[],
    orderBy?: string,
    orderDir?: 'ASC' | 'DESC',
    where?: string | ObjectLiteral,
  ): Promise<any[]> {
    const products = await super.findAll(
      take,
      relations,
      orderBy,
      orderDir,
      where,
    );

    const prods = [];
    for (const p of products) {
      const count = await this.favoritesRepository.count({
        where: { product: p.id },
      });
      (p as any).favoriteCount = count;
      prods.push(p);
    }
    return prods;
  }

  async findOne(id: number, options?: FindOneOptions<Product>) {
    if (options?.relations && options?.relations.includes('favorites')) {
      return await super.findOne(id);
    }

    // Adding count of favorites
    const relations = options?.relations.filter((r) => r !== 'favorites');
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
