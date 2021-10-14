import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderProduct } from 'src/api/order/order-product/order-product.entity';
import { OrderState } from 'src/api/order/order-state/order-state.entity';
import { Order } from 'src/api/order/order.entity';
import { Product } from 'src/api/products/products.entity';
import { User } from 'src/api/users/users.entity';
import { OrderStateService } from './order-state/order-state.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderProduct, OrderState, Product, User]),
  ],
  providers: [OrderStateService],
})
export class OrderSeederModule {}
