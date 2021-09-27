import { PipeTransform } from '@nestjs/common';
import { FiltersValidationPipe } from './filters-validation.pipe';
import { OrderByValidationPipe } from './orderby-validation.pipe';
import { OrderDirValidationPipe } from './orderdir-validation.pipe';
import { RelationsValidationPipe } from './relations-validation.pipe';

/** Validates FindOneOptionsDTO from Query */
export default class FindOneValidationPipe implements PipeTransform {
  /**
   * @param validProps A string list of props that can be used in where/order
   * @param relations A string list of relations that can be included with the entity
   */
  constructor(private validProps: string[], private relations: string[]) {}

  transform(query: any) {
    if (query.orderBy) {
      query.orderBy = new OrderByValidationPipe(this.validProps).transform(
        query.orderBy,
      );
      if (query.orderDirection) {
        query.orderDirection = new OrderDirValidationPipe().transform(
          query.orderDirection,
        );
      } else {
        query.orderDirection = 'DESC';
      }
      query.order = {};
      query.order[query.orderBy] = query.orderDirection;
    }
    if (query.relations) {
      query.relations = new RelationsValidationPipe(this.relations).transform(
        query.relations,
      );
    }
    if (query.filters) {
      query.where = new FiltersValidationPipe(this.validProps).transform(
        query.filters,
      );
    }
    return query;
  }
}
