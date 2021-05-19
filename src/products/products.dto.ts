import { Product } from './products.entity';

export class ProductDTO {
  /**
   * Generates a response object from a `Product`
   * @param product Product to generate response from
   */
  static generateRO(input: Product | Product[]): any {
    const products: Product[] = [].concat(input);
    const p = products.map((p) => p.toResponseObject());
    return p.length === 1 ? p[0] : p;
  }
}
