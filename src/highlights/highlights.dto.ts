import { Highlight } from './highlights.entity';

/**
 * Highlight Response Object class
 */
export class HighlightRO {
  /**
   * Generates a response object from a `Highlight`
   * @param highlight Highlight to generate response from
   */
  static generate(input: Highlight | Highlight[]): any {
    const highlights = [].concat(input);
    const h = highlights.map((h) => h.highlight);
    return h.length === 1 ? h[0] : h;
  }
}
