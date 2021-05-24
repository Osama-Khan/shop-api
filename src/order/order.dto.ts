import { Order } from './order.entity';

export class UserDTO {
  /**
   * Generates a response object from a `User`
   * @param input User to generate response from
   */
  static generateRO(input: Order | Order[]): any {
    const orders: Order[] = [].concat(input);
    const o = orders.map((o) => o.toResponseObject());
    return o.length === 1 ? o[0] : o;
  }
}
