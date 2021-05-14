import { HttpException, HttpStatus, Injectable, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryRO } from 'src/categories/categories.dto';
import { Category } from 'src/categories/categories.entity';
import { CategoriesService } from 'src/categories/categories.service';
import { HighlightRO } from 'src/highlights/highlights.dto';
import { Highlight } from 'src/highlights/highlights.entity';
import { FindManyOptions, Repository } from 'typeorm';
import { Product } from './products.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(Highlight)
    private highlightsRepository: Repository<Highlight>,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) { }

  async findAll(
    take: number = 10, 
    include: string = "", 
    orderBy: string = "created_at", 
    orderDir: "ASC" | "DESC" = "DESC", 
    filterCol: keyof(Product), 
    filterVal = undefined
    ): Promise<Product[]> {
    const returnHighlights = include.includes("highlights"),
          returnCategory = include.includes("category");

    let options: FindManyOptions = {};
    options.take = take;
    options.where = filterCol? {filterCol: filterVal}: {};
    options.order = {};
    options.order[orderBy] = orderDir;
    return await this.productsRepository.find(options).then(async p => {
      let pr = p.map(async p => {
        if (returnHighlights) {
          p.highlights = 
            await this.highlightsRepository.find({ where: { product: p } }).then(h => 
              HighlightRO.generate(h)
            );
        }
        if (returnCategory) {
          p.category = 
            await this.categoriesRepository.find(p.category).then(c => 
              CategoryRO.generate(c)
            );
        }
        return p;
      });
      return await Promise.all(pr);
    });
  }

  async findOne(id: string): Promise<Product> {
    return await this.productsRepository.findOne(id).then(async p => {
      if (!p) throw new HttpException("Product not found!", HttpStatus.NOT_FOUND);
      p.highlights = await this.highlightsRepository.find({ where: { product: p } }).then(h => 
        HighlightRO.generate(h)
      );
      p.category = await this.categoriesRepository.findOne(p.category).then(c =>
        CategoryRO.generate(c)  
      );
      return p;
    });
  }

  async remove(id: string): Promise<number> {
    let p = await this.findOne(id);
    let h = await this.highlightsRepository.find({ where: { product: p } });
    await h.forEach(h => this.highlightsRepository.delete(h));
    return (await this.productsRepository.delete(id)).affected;
  }

  async insert(product): Promise<Product> {
    // Attach category to product
    let c = await this.categoriesRepository.findOne({where: {name: product.category}});
    if (!c) {
      const cat = new Category();
      cat.name = product.category;
      const cId = await (await this.categoriesRepository.insert(cat)).generatedMaps["id"];
      product.category = await this.categoriesRepository.findOne(cId);
    } else {
      product.category = c;
    }

    // Insert product
    let out = await this.productsRepository.insert(product);

    // Add Highlights
    await Promise.all(product.highlights.map(async (highlight) => 
      await this.highlightsRepository.insert({ product, highlight: highlight })
    ));

    // Return created product
    return await this.findOne(out.generatedMaps["id"]);
  }

  async update(id, product: Product): Promise<Product> {
    await this.productsRepository.update(id, product);
    return await this.findOne(id);
  }
}
