import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PermissionDTO } from 'src/permissions/permissions.dto';
import { Permission } from 'src/permissions/permissions.entity';
import QueryHelper from 'src/shared/helpers/query.helper';
import { FindManyOptions, Repository } from 'typeorm';
import { Role } from './roles.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
    @InjectRepository(Permission)
    private permissionsRepository: Repository<Permission>,
  ) {}

  /**
   * Finds roles that match the given criteria
   * @param take The maximum number of records to return
   * @param includes A semicolon separated list of related properties to include
   * @param orderBy A string representing a column of `Role` to order by
   * @param orderDir Direction to order the Role by
   * @param filters A semicolon separated list of column=value formatted filters
   * @returns A promise that resolves to an array of roles
   */
  async findAll(
    take = 10,
    includes = [],
    orderBy = 'createdAt',
    orderDir: 'ASC' | 'DESC' = 'DESC',
    filters,
  ): Promise<Role[]> {
    const returnPermissions =
      includes.findIndex((i) => i == 'permissions') != -1;
    const options: FindManyOptions = {};
    options.take = take;
    options.where = filters;
    options.order = {};
    options.order[orderBy] = orderDir;
    return await this.rolesRepository.find(options).then(async (r) => {
      const roles = r.map(async (r) => {
        if (returnPermissions) {
          r.permissions = await this.permissionsRepository
            .find({ where: { role: r } })
            .then((p) => PermissionDTO.generateRO(p));
        }
        return r;
      });
      return await Promise.all(roles);
    });
  }

  /**
   * Gets a role with given id
   * @param id The id of role to find
   * @returns A promise that resolves to the `Role` with given id
   */
  async findOne(id: string): Promise<Role> {
    return await this.rolesRepository.findOne(id).then(async (r) => {
      if (!r) throw new HttpException('Role not found!', HttpStatus.NOT_FOUND);
      if (r.permissions) {
        r.permissions = await this.permissionsRepository
          .findByIds(r.permissions.map((p) => p.id))
          .then((p) => PermissionDTO.generateRO(p));
      } else {
        r.permissions = [];
      }
      return r;
    });
  }

  /**
   * Removes a role from the database
   * @param id The id of role to delete
   * @returns A promise that resolves to the `Role` removed
   */
  async remove(id: string): Promise<Role> {
    const r = await this.findOne(id);
    this.rolesRepository.delete(r.id);
    return r;
  }

  /**
   * Inserts a role into the database
   * @param role The role object to insert
   * @returns A promise that resolves to the `Role` inserted
   */
  async insert(role: Role): Promise<Role> {
    const out = await this.rolesRepository.insert(role);
    return await this.findOne(out.generatedMaps['id']);
  }

  /**
   * Updates a role in the database
   * @param id The id of role to update
   * @param role Object containing the properties of role to update
   * @returns A promise that resolves to the `Role` updated
   */
  async update(id: string, role: Role): Promise<Role> {
    await this.rolesRepository.update(id, role);
    return await this.findOne(id);
  }
}
