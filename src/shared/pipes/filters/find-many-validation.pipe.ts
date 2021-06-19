import { PipeTransform } from '@nestjs/common';
import FindOneValidationPipe from './find-one-validation.pipe';
import { LimitValidationPipe } from './limit-validation.pipe';

/** Validates FindManyOptionsDTO from Query */
export default class FindManyValidationPipe
  extends FindOneValidationPipe
  implements PipeTransform {
  /**
   * @param validProps A string list of props that can be used in where/order
   * @param relations A string list of relations that can be included with the entity
   */
  constructor(validProps: string[], relations: string[]) {
    super(validProps, relations);
  }

  transform(query: any) {
    query = super.transform(query);
    if (query.limit) {
      query.take = new LimitValidationPipe().transform(query.limit);
    }
    return query;
  }
}
