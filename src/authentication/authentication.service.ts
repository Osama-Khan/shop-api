import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/users.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import IRegisterModel from './models/register.model';
import ILoginModel from './models/login.model';
import { ApiService } from 'src/shared/services/api.service';
import JwtHelper from 'src/shared/helpers/jwt.helper';
import { Setting } from 'src/setting/setting.entity';

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
    const id = insertResult.generatedMaps['id'];

    // Create a setting for the user
    const setting = this.settingsRepository.create({ id, user });
    this.settingsRepository.insert(setting);

    return (await this.usersRepository.findOne(id)).toResponseObject();
  }
}
