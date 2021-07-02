import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { rolesKey } from '../decorators/roles.decorator';
import JwtHelper from '../helpers/jwt.helper';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.getAllAndOverride<string[]>(rolesKey, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!roles) {
      return true;
    }

    const req = context.switchToHttp().getRequest();
    const userData: any = JwtHelper.verifySession(req);
    if (userData) {
      if (
        userData.roles &&
        roles.every((r) =>
          userData.roles.some((ur) => {
            return r === ur;
          }),
        )
      ) {
        return true;
      } else {
        throw new ForbiddenException(
          "You don't have permission to access this resource.",
        );
      }
    }
  }
}
