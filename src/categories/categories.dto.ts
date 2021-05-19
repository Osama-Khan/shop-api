import { Category } from './categories.entity';

export class CategoryDTO {
  /**
   * Generates a response object from a `Category`
   * @param input Category to generate response from
   */
  static generateRO(input: Category | Category[]) {
    const categories = [].concat(input);
    const c = categories.map((c) => c.toResponseObject());
    return c.length === 1 ? c[0] : c;
  }
}
