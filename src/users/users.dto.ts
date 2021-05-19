import { User } from './users.entity';

export class UserDTO {
  /**
   * Generates a response object from a `User`
   * @param input User to generate response from
   */
  static generateRO(input: User | User[]): any {
    const users: User[] = [].concat(input);
    const u = users.map((u) => u.toResponseObject());
    return u.length === 1 ? u[0] : u;
  }
}
