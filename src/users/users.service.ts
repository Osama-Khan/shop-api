import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductRO } from 'src/products/products.dto';
import { Product } from 'src/products/products.entity';
import QueryHelper from 'src/shared/query.helper';
import { FindManyOptions, Repository } from 'typeorm';
import { User } from './users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  /**
   * Finds users that match the given criteria
   * @param take The maximum number of records to return
   * @param include A semicolon separated list of related properties to include
   * @param orderBy A string representing a column of `User` to order by
   * @param orderDir Direction to order the User by
   * @param filters A semicolon separated list of column=value formatted filters
   * @returns A promise that resolves to an array of users
   */
  async findAll(
    take = 10,
    includes = '',
    orderBy = 'createdAt',
    orderDir: 'ASC' | 'DESC' = 'DESC',
    filters: string,
  ): Promise<User[]> {
    const includesArray = includes ? includes.split(';') : [];
    const returnProducts =
      includesArray.findIndex((i) => i == 'products') != -1;
    const options: FindManyOptions = {};
    options.take = take;
    options.where = QueryHelper.filterObjectFrom(filters, User.prototype);
    options.order = {};
    options.order[orderBy] = orderDir;
    return await this.usersRepository.find(options).then(async (u) => {
      const pr = u.map(async (u) => {
        if (returnProducts) {
          u.products = await this.productsRepository
            .find({ where: { user: u } })
            .then((p) => ProductRO.generate(p));
        }
        return u;
      });
      return await Promise.all(pr);
    });
  }

  /**
   * Gets a user with given id
   * @param id The id of user to find
   * @returns A promise that resolves to the `User` with given id
   */
  async findOne(id: string): Promise<User> {
    return await this.usersRepository.findOne(id).then(async (u) => {
      if (!u) throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
      u.products = await this.productsRepository
        .find({ where: { user: u } })
        .then((p) => ProductRO.generate(p));
      return u;
    });
  }

  /**
   * Removes a user from the database
   * @param id The id of user to delete
   * @returns A promise that resolves to the `User` removed
   */
  async remove(id: string): Promise<User> {
    const u = await this.findOne(id);
    const p = await this.productsRepository.find({ where: { user: u } });
    await p.forEach((h) => this.productsRepository.delete(h));
    return u;
  }

  /**
   * Inserts a user into the database
   * @param user The user object to insert
   * @returns A promise that resolves to the `User` inserted
   */
  async insert(user): Promise<User> {
    const out = await this.usersRepository.insert(user);
    return await this.findOne(out.generatedMaps['id']);
  }

  /**
   * Updates a user in the database
   * @param id The id of user to update
   * @param user Object containing the properties of user to update
   * @returns A promise that resolves to the `User` updated
   */
  async update(id: string, user: User): Promise<User> {
    await this.usersRepository.update(id, user);
    return await this.findOne(id);
  }
}
