import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { ApiService } from 'src/shared/services/api.service';
import { Product } from 'src/products/products.entity';
import { OrderProduct } from 'src/order/order-product/order-product.entity';
import { User } from 'src/users/users.entity';

@Injectable()
export class OrderService extends ApiService<Order> {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderProduct)
    private opRepository: Repository<OrderProduct>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    super(orderRepository, Order.relations);
  }

  async placeOrder(orderDetail) {
    const { address, userId } = orderDetail;
    const user = await this.userRepository.findOne(userId);
    if (!user) {
      throw new BadRequestException('The user placing order does not exist');
    }
    let order = this.orderRepository.create({
      address,
      user,
      orderState: { id: 0 }, // Default State 'Processing'
    });
    const orderRes = await this.orderRepository.insert(order);
    order = await this.orderRepository.findOne(orderRes.generatedMaps[0].id);
    const orderDetails = await orderDetail.products.map(async (od: any) => {
      const product = await this.productRepository.findOne(od.id);
      if (!product) {
        throw new BadRequestException(
          'One of the provided products does not exist',
        );
      }
      const price = product.price * od.quantity;
      const detail = this.opRepository.create({
        order,
        product,
        quantity: od.quantity,
        price,
      });
      await this.opRepository.insert(detail);
      return detail;
    });
    if (orderDetails.length === 0) {
      throw new BadRequestException('No products provided');
    }
    return order;
  }
}
