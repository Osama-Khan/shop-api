import { forwardRef, Inject } from '@nestjs/common';
import IsOwnerGuard from 'src/api/shared/guards/is-owner.guard';
import { ProductsService } from './products.service';

export default class IsProductOwnerGuard extends IsOwnerGuard<ProductsService> {
  constructor(
    @Inject(forwardRef(() => ProductsService)) service: ProductsService,
  ) {
    super(service, 'product');
  }
}
