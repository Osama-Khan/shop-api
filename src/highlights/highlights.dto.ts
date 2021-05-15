import { Highlight } from './highlights.entity';

export class HighlightDTO {
  /**
   * Generates a response object from a `Highlight`
   * @param input Highlight to generate response from
   */
  static generateRO(input: Highlight | Highlight[]): any {
    const highlights = [].concat(input);
    const h = highlights.map((h) => h.highlight);
    return h.length === 1 ? h[0] : h;
  }
}
