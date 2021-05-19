import { BadRequestException, PipeTransform } from '@nestjs/common';

export class LoginDataValidationPipe implements PipeTransform {
  transform(data) {
    if (this.isInvalid(data)) {
      throw new BadRequestException('Invalid object provided');
    }
    return data;
  }

  isInvalid(o: any): boolean {
    const requiredKeys = ['username', 'password'];
    const invalid =
      !Object.keys(o).every((k) => requiredKeys.includes(k)) ||
      typeof o.username !== 'string' ||
      typeof o.password !== 'string';
    return invalid;
  }
}
