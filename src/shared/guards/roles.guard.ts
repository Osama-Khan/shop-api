import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { rolesKey } from '../decorators/roles.decorator';
import * as jwt from 'jsonwebtoken';
import { User } from 'src/users/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectRepository(User) private usersRepo: Repository<User>,
  ) {}
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

    if (!req.body || !req.body.token) {
      throw new ForbiddenException(
        'You need to be logged in to perform this action!',
      );
    }

    const userData = jwt.verify(req.body.token, process.env.SECRET);
    if (userData) {
      return this.usersRepo
        .findOne({
          where: { username: userData['username'] },
          relations: ['roles'],
        })
        .then((u) => {
          if (
            u.roles &&
            roles.every((r) => u.roles.some((ur) => r === ur.name))
          ) {
            return true;
          } else {
            throw new UnauthorizedException(
              'You are not authorized to perform this action',
            );
          }
        });
    }
  }
}
