import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/api/users/users.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import IRegisterModel from './models/register.model';
import ILoginModel from './models/login.model';
import { ApiService } from 'src/api/shared/services/api.service';
import JwtHelper from 'src/api/shared/helpers/jwt.helper';
import { Setting } from 'src/api/setting/setting.entity';

@Injectable()
export class AuthenticationService extends ApiService<User> {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Setting)
    private readonly settingsRepository: Repository<Setting>,
  ) {
    super(usersRepository);
  }

  async login(loginModel: ILoginModel) {
    const u = await this.usersRepository.findOne({
      where: { username: loginModel.username },
      relations: ['roles'],
    });
    if (!u) throw new UnauthorizedException('Invalid user');
    let response: any;
    if (bcrypt.compareSync(loginModel.password, u.password)) {
      response = u.toResponseObject();
      response.email = u.email;
    } else {
      throw new UnauthorizedException('Invalid password');
    }
    response.token = JwtHelper.sign(
      {
        id: u.id,
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

  async loginWithToken(authHeader: string) {
    try {
      const token = authHeader.split(' ')[1];
      const { username } = JwtHelper.verify(token) as any;
      const user = await this.usersRepository.findOne({
        where: { username },
        relations: ['roles'],
      });
      if (!user) {
        throw Error;
      }

      const res = user.toResponseObject();
      res['email'] = user.email;
      return res;
    } catch (ex) {
      throw new UnauthorizedException(
        'Your session is either invalid or has expired. Please login again!',
      );
    }
  }

  async register(registerModel: IRegisterModel): Promise<any> {
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
    const id = insertResult.generatedMaps[0].id;

    // Create a setting for the user
    const setting = this.settingsRepository.create({ id, user });
    this.settingsRepository.insert(setting);

    return (await this.usersRepository.findOne(id)).toResponseObject();
  }
}
