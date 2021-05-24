import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/users.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserDTO } from 'src/users/users.dto';
import IRegisterModel from './models/register.model';
import ILoginModel from './models/login.model';
import { ApiService } from 'src/shared/services/api.service';
import JwtHelper from 'src/shared/helpers/jwt.helper';

@Injectable()
export class AuthenticationService extends ApiService<User> {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {
    super(usersRepository, UserDTO.generateRO);
  }

  async login(loginModel: ILoginModel) {
    const u = await this.usersRepository.findOne({
      where: { username: loginModel.username },
      relations: ['roles'],
    });
    if (!u) throw new UnauthorizedException('Invalid user');
    let response: any;
    if (bcrypt.compareSync(loginModel.password, u.password)) {
      const { firstName, lastName, username, email, dateOfBirth, roles } = u;
      response = { firstName, lastName, username, email, dateOfBirth, roles };
    } else {
      throw new UnauthorizedException('Invalid password');
    }
    response.token = JwtHelper.sign(
      {
        username: loginModel.username,
        password: u.password,
        roles: u.roles.map((r) => r.name),
      },
      {
        expiresIn: '1d',
      },
    );
    return response;
  }

  async register(registerModel: IRegisterModel): Promise<User> {
    let user = await this.usersRepository.findOne({
      where: [
        { username: registerModel.username },
        { email: registerModel.email },
      ],
    });
    if (user) {
      throw new BadRequestException('User already exists');
    }
    user = this.usersRepository.create(registerModel);
    const insertResult = await this.usersRepository.insert(user);
    return (
      await this.usersRepository.findOne(insertResult.generatedMaps['id'])
    ).toResponseObject();
  }
}
