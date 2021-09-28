import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import paginate from '../../api/shared/helpers/paginate.helper';
import generateRO from '../../api/shared/helpers/ro.helper';
import FindManyOptionsDTO from '../models/find-many-options.dto';
import FindOneOptionsDTO from '../models/find-one-options.dto';

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
   * @param options A FindManyOptions DTO that contains the set of filters to apply
   * @returns A promise that resolves to an array of entities
   */
  async findAll(
    options: FindManyOptionsDTO<Entity>,
  ): Promise<{ data: any[]; meta: any }> {
    const [dt, count] = await this.repository.findAndCount(options);
    const data = dt.map((e: any) => {
      return e.toResponseObject();
    });

    return paginate(data, options, count);
  }

  /**
   * Gets an entity with given id
   * @param id The id of entity to find
   * @param options A FindOneOptionsDTO containing options to further filter the records
   * @returns A promise that resolves to the `Entity` with given id
   */
  async findOne(
    id: number,
    options?: FindOneOptionsDTO<Entity>,
  ): Promise<Entity> {
    if (options && !options.relations) {
      options.relations = this.findOneRelations;
    }
    return await this.repository.findOne(id, options).then(async (e) => {
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
    const exists = await this.findOne(id, { relations: [] });
    if (!exists) throw new NotFoundException('Entity not found!');
    await this.repository.update(id, e);
    return await this.findOne(id);
  }

  /**
   * Counts rows in entity matching the given options
   * @param options Options to filters rows
   * @returns A number representing count of rows
   */
  async count(options: FindManyOptionsDTO<Entity>): Promise<number> {
    return await this.repository.count(options);
  }
}
