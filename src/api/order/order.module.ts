import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { Order } from './order.entity';
import { OrderProduct } from 'src/api/order/order-product/order-product.entity';
import { Product } from 'src/api/products/products.entity';
import { User } from 'src/api/users/users.entity';
import { OrderState } from './order-state/order-state.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderProduct, OrderState, Product, User]),
  ],
  providers: [OrderService],
  controllers: [OrderController],
})
export class OrderModule {}
