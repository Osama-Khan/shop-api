import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    if (req.body && req.body.token) {
      const token = req.body.token;
      const ver = jwt.verify(token, process.env.SECRET);
      if (ver) {
        return true;
      }
    }
    return false;
  }
}
