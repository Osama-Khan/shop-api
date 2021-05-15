import { BadRequestException, PipeTransform } from '@nestjs/common';

export class FiltersValidationPipe implements PipeTransform {
  /**
   * @param validProps an array of valid properties
   */
  constructor(private validProps?: string[]) {}
  transform(filters) {
    if (filters) {
      const f = filters.split(';');
      const obj = {};
      f.forEach((f, i) => {
        const keyVal = f.split('=');
        const [key, val] = [keyVal[0].toLowerCase(), keyVal[1]];
        if (
          keyVal.length !== 2 ||
          (this.validProps && this.validProps.indexOf(key) === -1)
        ) {
          throw new BadRequestException(
            `Invalid key value pair for filter at index ${i}`,
          );
        }
        obj[key] = val;
      });
      filters = obj;
    }
    return filters;
  }
}
