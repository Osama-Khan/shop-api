import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ObjectLiteral, Repository } from 'typeorm';
import { CriteriaHelper } from '../helpers/criteria.helper';
import generateRO from '../helpers/ro.helper';

/**
 * Service containing the general operations of an API service
 */
export abstract class ApiService<Entity> {
  /**
   *
   * @param repository Repository used for database operations.
   * @param possibleRelations String array of relations that can be selected and returned.
   * @param findOneRelations String array of relations that are returned from `findOne`
   * method. Default value is the value of possible relations.
   */
  constructor(
    private repository: Repository<Entity>,
    private possibleRelations: string[] = [],
    private findOneRelations: string[] = possibleRelations,
  ) {}

  /**
   * Finds entities that match the given criteria
   * @param take The maximum number of records to return
   * @param relations A semicolon separated list of related entities to include
   * @param orderBy A string representing a column of `Entity` to order by
   * @param orderDir Direction of ordered column
   * @param where A semicolon separated list of column=value formatted filters
   * @returns A promise that resolves to an array of entities
   */
  async findAll(
    take = 10,
    relations = [],
    orderBy = 'createdAt',
    orderDir: 'ASC' | 'DESC' = 'DESC',
    where: ObjectLiteral | string = {},
  ): Promise<Entity[]> {
    const options = CriteriaHelper.generateOptionsObject(
      take,
      relations,
      orderBy,
      orderDir,
      where,
    );
    return await this.repository.find(options).then(async (e) => {
      const entities = e.map(async (e) => {
        const ro = generateRO(e);
        return ro;
      });
      return await Promise.all(entities);
    });
  }

  /**
   * Gets an entity with given id
   * @param id The id of entity to find
   * @returns A promise that resolves to the `Entity` with given id
   */
  async findOne(id: number): Promise<Entity> {
    return await this.repository
      .findOne(id, { relations: this.findOneRelations })
      .then(async (e) => {
        if (!e) throw new NotFoundException('Entity not found!');
        const entityRO = generateRO(this.repository.create(e));
        return entityRO;
      });
  }

  /**
   * Removes an entity from the database
   * @param id The id of entity to delete
   * @returns A promise that resolves to the `Entity` removed
   */
  async remove(id: number): Promise<Entity> {
    const e = await this.findOne(id);
    if (!e) throw new NotFoundException('Entity not found!');
    await this.repository.softRemove(e);
    return e;
  }

  /**
   * Inserts an entity into the database
   * @param entity The entity object to insert
   * @returns A promise that resolves to the `Entity` inserted
   */
  async insert(entity: Entity): Promise<Entity> {
    const e = this.repository.create(entity);
    try {
      const out = await this.repository.insert(e);
      return await this.findOne(out.generatedMaps[0].id);
    } catch (e) {
      if (e.message.startsWith('Duplicate entry')) {
        throw new BadRequestException('A similar entity already exists');
      } else {
        throw e;
      }
    }
  }

  /**
   * Updates an entity in the database
   * @param id The id of entity to update
   * @param entity Object containing the properties of entity to update
   * @returns A promise that resolves to the `Entity` updated
   */
  async update(id: number, entity: Entity): Promise<Entity> {
    const e = this.repository.create(entity);
    const exists = await this.repository.findOne(id);
    if (!exists) throw new NotFoundException('Entity not found!');
    await this.repository.update(id, e);
    return await this.findOne(id);
  }
}
