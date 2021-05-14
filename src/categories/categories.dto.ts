import { Category } from './categories.entity';

/**
 * Category Response Object class
 */
export class CategoryRO {
  /**
   * Generates a response object from a `Category`
   * @param input Category to generate response from
   */
  static generate(input: Category | Category[]) {
    const categories = [].concat(input);
    const c = categories.map((c) => c.name);
    return c.length === 1 ? c[0] : c;
  }
}
