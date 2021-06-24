import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { ApiService } from 'src/shared/services/api.service';
import { Product } from 'src/products/products.entity';
import { OrderProduct } from 'src/order/order-product/order-product.entity';
import { User } from 'src/users/users.entity';
import { OrderState } from './order-state/order-state.entity';

@Injectable()
export class OrderService extends ApiService<Order> {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderProduct)
    private opRepository: Repository<OrderProduct>,
    @InjectRepository(OrderState)
    private osRepository: Repository<OrderState>,
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

    const products = [];
    for (let i = 0; i < orderDetail.products.length; i++) {
      const p = orderDetail.products[i];
      const prod = await this.productRepository.findOne(p.id);
      if (prod.stock < p.quantity)
        throw new BadRequestException(
          'One of the products does not have enough stock',
        );
      if (!prod)
        throw new BadRequestException(
          'One of the provided products does not exist',
        );
      products.push(prod);
    }

    if (products.length === 0) {
      throw new BadRequestException('No products provided');
    }

    const orderRes = await this.orderRepository.insert(order);
    order = await this.orderRepository.findOne(orderRes.generatedMaps[0].id);
    await orderDetail.products.map(async (od: any, i: number) => {
      const product = products[i];
      const price = product.price * od.quantity;
      const detail = this.opRepository.create({
        order,
        product,
        quantity: od.quantity,
        price,
      });
      const newStock = product.stock - od.quantity;
      await this.productRepository.update(product.id, { stock: newStock });
      await this.opRepository.insert(detail);
      return detail;
    });
    return order;
  }

  async getDetail(id: number) {
    // Verifies if order exists
    await this.findOne(id);

    const details = await this.opRepository.find({
      where: { order: id },
      relations: ['product'],
    });
    return details;
  }

  async getOrderStates() {
    return await this.osRepository.find();
  }
}
