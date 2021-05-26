import { Address } from './address.entity';

export class AddressDTO {
  /**
   * Generates a response object from an `Address`
   * @param input Address to generate response from
   */
  static generateRO(input: Address | Address[]): any {
    const addresses = [].concat(input);
    const a = addresses.map((a) => a.toResponseObject());
    return a.length === 1 ? a[0] : a;
  }
}
