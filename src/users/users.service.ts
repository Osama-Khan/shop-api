import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDTO } from './users.dto';
import { User } from './users.entity';
import { Role } from 'src/roles/roles.entity';
import { ApiService } from 'src/shared/services/api.service';
import { Address } from 'src/address/address.entity';

@Injectable()
export class UsersService extends ApiService<User> {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
    @InjectRepository(Address)
    private addressRepository: Repository<Address>,
  ) {
    super(usersRepository, UserDTO.generateRO, User.relations);
  }

  /**
   * Assigns role to a user
   * @param id The id of user to assign role to
   * @param roleName name of the role to assign
   * @returns A promise that resolves to `User`
   */
  async addRole(id: number, roleName: string): Promise<User> {
    const role = await this.rolesRepository.findOne({
      where: { name: roleName },
    });
    const user = await this.usersRepository.findOne(id, {
      relations: ['roles'],
    });
    if (!user) {
      throw new BadRequestException('No such user');
    }
    if (!role) {
      throw new BadRequestException('No such role');
    }
    if (user.roles && user.roles.includes(role)) {
      throw new BadRequestException(
        'Given role is already assigned to the given user',
      );
    }
    user.roles = user.roles ? [...user.roles, role] : [role];
    const u = this.usersRepository.create(user);
    await this.usersRepository.save(user);
    return UserDTO.generateRO(u);
  }

  /**
   * Adds an address to user
   * @param id The id of user to add address to
   * @param address the address object
   * @returns A promise that resolves to `Address`
   */
  async addAddress(id: number, address: Address): Promise<User> {
    const user = await this.usersRepository.findOne(id, {
      relations: ['addresses'],
    });
    if (!user) {
      throw new BadRequestException('No such user');
    }
    const addrEnt = this.addressRepository.create(address);
    addrEnt.user = user;
    await this.addressRepository.insert(addrEnt);
    return await this.usersRepository.findOne(id, {
      relations: ['addresses'],
    });
  }

  /**
   * Gets the most recent product of given user
   */
  async getRecentProduct(userId: number) {
    const user = await this.usersRepository.findOne(userId, {
      relations: ['products'],
    });
    if (!user) {
      throw new BadRequestException('No such user');
    }
    if (!user.products || user.products.length <= 0) {
      throw new NotFoundException('User has no products');
    }
    const product = user.products.sort(
      (p1, p2) => p1.createdAt.getTime() - p2.createdAt.getTime(),
    )[0];
    return product;
  }
}
