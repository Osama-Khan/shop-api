import { FindManyOptions, ObjectLiteral } from 'typeorm';

export class CriteriaHelper {
  static generateOptionsObject(
    take = 10,
    relations = [],
    orderBy = 'createdAt',
    orderDir: 'ASC' | 'DESC' = 'DESC',
    where: ObjectLiteral | string,
  ): FindManyOptions {
    const options: FindManyOptions = { take, relations, where };
    options.order = {};
    options.order[orderBy] = orderDir;
    return options;
  }
}
