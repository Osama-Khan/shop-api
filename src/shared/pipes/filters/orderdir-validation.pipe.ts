import { BadRequestException, PipeTransform } from '@nestjs/common';

export class OrderDirValidationPipe implements PipeTransform {
  transform(orderDir): 'ASC' | 'DESC' {
    if (orderDir) {
      orderDir = orderDir.toUpperCase();
      if (orderDir !== 'ASC' && orderDir !== 'DESC') {
        throw new BadRequestException('Invalid order direction');
      }
    }
    return orderDir;
  }
}
