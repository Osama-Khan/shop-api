import { Role } from './roles.entity';

export class RoleDTO {
  /**
   * Generates a response object from a `Role`
   * @param input Role to generate response from
   */
  static generateRO(input: Role | Role[]): any {
    const roles: Role[] = [].concat(input);
    const r = roles.map((r) => r.toResponseObject());
    return r.length === 1 ? r[0] : r;
  }
}
