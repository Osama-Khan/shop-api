import { OrderProduct } from './order-product.entity';

export class OrderProductDTO {
  /**
   * Generates a response object from a `Highlight`
   * @param input Highlight to generate response from
   */
  static generateRO(input: OrderProduct | OrderProduct[]): any {
    const detail = [].concat(input);
    const d = detail.map((d) => d.toResponseObject());
    return d.length === 1 ? d[0] : d;
  }
}
