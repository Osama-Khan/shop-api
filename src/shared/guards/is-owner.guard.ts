import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import JwtHelper from '../helpers/jwt.helper';
import { getBearerFromRequest } from '../helpers/request.helper';
import { ApiService } from '../services/api.service';

/**
 * Verifies that the currently logged in user is the owner of accessed item
 */
export default abstract class IsOwnerGuard<ItemService extends ApiService<any>>
  implements CanActivate {
  /**
   * @param service Reference to the service used for accessing item data
   * @param itemName Name to use for the item in exceptions
   */
  constructor(private service: ItemService, private itemName = 'resource') {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const id = req.params.id;
    const token = getBearerFromRequest(req)?.split(' ')[1];
    let userId: number;
    try {
      const data = JwtHelper.verify(token);
      userId = data['id'];
    } catch (exception) {
      this.throwForbidden();
    }
    const item = await this.service.findOne(id, { relations: ['user'] });
    if (!item) {
      throw new NotFoundException(
        `The ${this.itemName} you are trying to access does not exist.`,
      );
    }
    if (item['user']?.id !== userId) {
      this.throwForbidden();
    }
    return true;
  }

  throwForbidden = () => {
    throw new ForbiddenException(
      `You don't have access to this ${this.itemName}.`,
    );
  };
}
