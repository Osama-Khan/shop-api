import { UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { getBearerFromRequest } from './request.helper';

export default class JwtHelper {
  static sign(object: any, options: jwt.SignOptions = {}) {
    return jwt.sign(object, process.env.SECRET, options);
  }

  static verify(object: any, options: jwt.SignOptions = {}) {
    return jwt.verify(object, process.env.SECRET, options);
  }

  static decode(object: any, options = {}) {
    return jwt.decode(object, options);
  }

  static verifySession(req: any) {
    const bearer = getBearerFromRequest(req);
    if (bearer) {
      const token = bearer.split(' ')[1];
      try {
        const ver = JwtHelper.verify(token);
        if (ver) {
          return ver;
        }
      } catch (e) {
        throw new UnauthorizedException(
          'Your session is either invalid or has expired. Please login again.',
        );
      }
    }
    throw new UnauthorizedException(
      'You need to be logged in to access this resource.',
    );
  }
}
