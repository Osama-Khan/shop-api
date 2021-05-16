import { BadRequestException, PipeTransform } from '@nestjs/common';

export class LoginDataValidationPipe implements PipeTransform {
  transform(data) {
    if (!data.username || !data.password) {
      throw new BadRequestException('Invalid parameters provided');
    }
    return data;
  }
}
