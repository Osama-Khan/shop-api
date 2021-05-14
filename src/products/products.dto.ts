import { Product } from "./products.entity";

/**
 * Product Response Object class
 */
export class ProductRO {
  /**
   * Generates a response object from a `Product`
   * @param product Product to generate response from
   */
  static generate(input: Product | Product[]): any {
    const products: Product[] = [].concat(input);
    const p = products.map(p => {p.title, p.description, p.rating, p.stock, p.img, p.category, p.updatedAt, p.createdAt});
    return p.length === 1? p[0]: p;
  }
}