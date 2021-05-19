import { Permission } from './permissions.entity';

export class PermissionDTO {
  /**
   * Generates a response object from a `Permission`
   * @param input Permission to generate response from
   */
  static generateRO(input: Permission | Permission[]): any {
    const permissions: Permission[] = [].concat(input);
    const p = permissions.map((p) => p.toResponseObject());
    return p.length === 1 ? p[0] : p;
  }
}
