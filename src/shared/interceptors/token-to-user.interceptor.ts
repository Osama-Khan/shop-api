import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import JwtHelper from '../helpers/jwt.helper';
import { getBearerFromRequest } from '../helpers/request.helper';

/** Attaches request sender's id to request body from bearer token. Request does
 * not change if token fails to verify or is not present in headers.
 */
@Injectable()
export default class TokenToUserInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const bearer = getBearerFromRequest(request);
    const token = bearer.split(' ')[1];
    try {
      const user = JwtHelper.verify(token);
      request.body._requestSenderId = user['id'];
    } catch (e) {}

    return next.handle();
  }
}
