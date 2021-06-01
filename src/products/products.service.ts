import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './products.entity';
import { ApiService } from 'src/shared/services/api.service';
import { Highlight } from 'src/highlights/highlights.entity';

@Injectable()
export class ProductsService extends ApiService<Product> {
  constructor(
    @InjectRepository(Product)
    productsRepository: Repository<Product>,
    @InjectRepository(Highlight)
    private highlightsRepository: Repository<Highlight>,
  ) {
    super(productsRepository, Product.relations);
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
