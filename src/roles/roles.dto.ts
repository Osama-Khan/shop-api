import { Role } from './roles.entity';

export class RoleDTO {
  /**
   * Generates a response object from a `Role`
   * @param input Role to generate response from
   */
  static generateRO(input: Role | Role[]): any {
    const roles: Role[] = [].concat(input);
    const u = roles.map((u) => ({
      name: u.name,
      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
    }));
    return u.length === 1 ? u[0] : u;
  }
}
