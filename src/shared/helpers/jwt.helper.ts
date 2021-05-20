import { ForbiddenException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

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
    if (req.body && req.body.token) {
      const token = req.body.token;
      try {
        const ver = JwtHelper.verify(token);
        if (ver) {
          return ver;
        }
      } catch (e) {
        throw new ForbiddenException(
          'Your session is either invalid or has expired',
        );
      }
    }
    throw new ForbiddenException(
      'You need to be logged in to access this resource',
    );
  }
}
