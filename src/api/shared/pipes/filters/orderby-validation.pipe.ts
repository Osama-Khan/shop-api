import { BadRequestException, PipeTransform } from '@nestjs/common';

export class OrderByValidationPipe implements PipeTransform {
  /**
   * @param validProps an array of valid properties
   */
  constructor(private validProps?: string[]) {}

  transform(orderBy) {
    if (orderBy) {
      orderBy.toLowerCase();
      if (this.validProps && !this.validProps.includes(orderBy)) {
        throw new BadRequestException('Invalid order column');
      }
    }
    return orderBy;
  }
}
