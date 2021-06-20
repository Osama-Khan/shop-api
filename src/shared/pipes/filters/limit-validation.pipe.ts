import { BadRequestException, PipeTransform } from '@nestjs/common';

export class LimitValidationPipe implements PipeTransform {
  transform(limit) {
    if (limit) {
      try {
        const l = parseInt(limit);
        if (l <= 0) throw new Error();
        if (l.toString() !== limit) throw new Error();
        limit = l;
      } catch (e) {
        throw new BadRequestException('Invalid Limit Value');
      }
    }
    return limit;
  }
}
