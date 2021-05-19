import { BadRequestException, PipeTransform } from '@nestjs/common';

export class RegisterDataValidationPipe implements PipeTransform {
  transform(data: any) {
    if (this.isValid(data)) {
      return data;
    }
  }

  isValid(o: any): boolean {
    const requiredKeys = [
      'username',
      'password',
      'firstName',
      'lastName',
      'email',
      'dateOfBirth',
    ];
    if (!Object.keys(o).every((k) => requiredKeys.includes(k))) {
      throw new BadRequestException('Invalid object keys');
    }
    if (typeof o.username !== 'string') {
      throw new BadRequestException('Invalid username');
    }
    if (typeof o.password !== 'string') {
      throw new BadRequestException('Invalid password');
    }
    if (typeof o.firstName !== 'string') {
      throw new BadRequestException('Invalid first name');
    }
    if (typeof o.lastName !== 'string') {
      throw new BadRequestException('Invalid last name');
    }
    if (typeof o.email !== 'string') {
      throw new BadRequestException('Invalid email');
    }
    if (!Date.parse(o.dateOfBirth)) {
      throw new BadRequestException('Invalid date of birth');
    }
    return true;
  }
}
