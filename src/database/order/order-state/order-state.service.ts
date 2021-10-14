import { InjectRepository } from '@nestjs/typeorm';
import { ApiService } from 'src/shared/services/api.service';
import { Repository } from 'typeorm';
import { OrderState } from 'src/api/order/order-state/order-state.entity';

export class OrderStateService extends ApiService<OrderState> {
  constructor(@InjectRepository(OrderState) repo: Repository<OrderState>) {
    super(repo);
  }
}
