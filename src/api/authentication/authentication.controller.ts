import { Body, Controller, Post, Req } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import ILoginModel from './models/login.model';
import IRegisterModel from './models/register.model';
import { LoginDataValidationPipe } from './pipes/login-data-validation.pipe';
import { RegisterDataValidationPipe } from './pipes/register-data-validation.pipe';

@Controller()
export class AuthenticationController {
  constructor(private authService: AuthenticationService) {}

  @Post('/login')
  login(@Body(new LoginDataValidationPipe()) userData: ILoginModel) {
    return this.authService.login(userData);
  }

  @Post('/login/token')
  loginWithToken(@Req() req) {
    return this.authService.loginWithToken(req.headers.authorization);
  }

  @Post('/register')
  register(
    @Body(new RegisterDataValidationPipe()) registerData: IRegisterModel,
  ) {
    return this.authService.register(registerData);
  }
}
