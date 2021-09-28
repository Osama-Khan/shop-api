import { Controller, Get } from '@nestjs/common';

@Controller()
export class ApiController {
  @Get()
  getWelcome() {
    return 'Welcome to Shop API';
  }
}
