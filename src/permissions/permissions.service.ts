import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import QueryHelper from 'src/shared/query.helper';
import { FindManyOptions, Repository } from 'typeorm';
import { Permission } from './permissions.entity';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private permissionsRepository: Repository<Permission>,
  ) {}

  /**
   * Finds permissions that match the given criteria
   * @param take The maximum number of records to return
   * @param include A semicolon separated list of related properties to include
   * @param orderBy A string representing a column of `Permission` to order by
   * @param orderDir Direction to order the Permission by
   * @param filters A semicolon separated list of column=value formatted filters
   * @returns A promise that resolves to an array of permissions
   */
  async findAll(
    take = 10,
    orderBy = 'createdAt',
    orderDir: 'ASC' | 'DESC' = 'DESC',
    filters: string,
  ): Promise<Permission[]> {
    const options: FindManyOptions = {};
    options.take = take;
    options.where = QueryHelper.filterObjectFrom(filters, Permission.prototype);
    options.order = {};
    options.order[orderBy] = orderDir;
    return await this.permissionsRepository.find(options).then(async (p) => {
      const perms = p.map(async (p) => {
        return p;
      });
      return await Promise.all(perms);
    });
  }

  /**
   * Gets a permission with given id
   * @param id The id of permission to find
   * @returns A promise that resolves to the `Permission` with given id
   */
  async findOne(id: string): Promise<Permission> {
    return await this.permissionsRepository.findOne(id).then(async (p) => {
      if (!p)
        throw new HttpException('Permission not found!', HttpStatus.NOT_FOUND);
      return p;
    });
  }
}
