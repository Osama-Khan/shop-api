import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/users.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserDTO } from 'src/users/users.dto';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  async login(username: string, password: string) {
    const u = await this.repository.findOne({ where: { username } });
    let response: any;
    if (u) {
      if (bcrypt.compareSync(password, u.password)) {
        response = UserDTO.generateRO(u);
      } else {
        throw new UnauthorizedException('Invalid password');
      }
    } else {
      throw new UnauthorizedException('Invalid user');
    }
    response.token = jwt.sign(
      { username, password: u.password },
      process.env.SECRET,
      {
        expiresIn: '1d',
      },
    );
    return response;
  }
}
