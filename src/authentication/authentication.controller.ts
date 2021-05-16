import { Body, Controller, Post } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { LoginDataValidationPipe } from './pipes/login-data-validation.pipe';

@Controller('/authentication')
export class AuthenticationController {
  constructor(private authService: AuthenticationService) {}

  @Post('/login')
  login(@Body(new LoginDataValidationPipe()) userData) {
    return this.authService.login(userData.username, userData.password);
  }
}
