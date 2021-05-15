import { BadRequestException, PipeTransform } from '@nestjs/common';

export class IncludesValidationPipe implements PipeTransform {
  /**
   * @param includes string array of includable properties
   */
  constructor(private includes?: string[]) {}
  transform(include) {
    if (include && this.includes) {
      const f = include.split(';');
      if (f.some((f) => this.includes.indexOf(f) === -1)) {
        throw new BadRequestException('Invalid includes provided!');
      }
      include = f;
    }
    return include;
  }
}
