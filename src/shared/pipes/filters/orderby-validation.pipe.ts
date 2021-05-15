import { BadRequestException, PipeTransform } from '@nestjs/common';

export class OrderByValidationPipe implements PipeTransform {
  /**
   * @param validProps an array of valid properties
   */
  constructor(private validProps?: string[]) {}

  transform(orderBy) {
    if (orderBy) {
      orderBy.toLowerCase();
      if (this.validProps && this.validProps.indexOf(orderBy) === -1) {
        throw new BadRequestException('Invalid order column');
      }
    }
    return orderBy;
  }
}
