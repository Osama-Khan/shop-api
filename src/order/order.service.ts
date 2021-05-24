import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDTO } from './order.dto';
import { Order } from './order.entity';
import { ApiService } from 'src/shared/services/api.service';

@Injectable()
export class OrderService extends ApiService<Order> {
  constructor(
    @InjectRepository(Order)
    orderRepository: Repository<Order>,
  ) {
    super(orderRepository, UserDTO.generateRO, Order.relations);
  }
}
