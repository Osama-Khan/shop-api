import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { ApiService } from 'src/api/shared/services/api.service';
import { Product } from 'src/api/products/products.entity';
import { OrderProduct } from 'src/api/order/order-product/order-product.entity';
import { User } from 'src/api/users/users.entity';
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

  /**
   * Gets order of a product if user has ordered it
   * @param uid ID of the user
   * @param pid ID of the product
   * @returns Order object, prioritized by status: Delivered > Shipped > Processing > Canceled
   */
  async getUserProduct(uid: number, pid: number) {
    const user = await this.userRepository.findOne(uid);
    if (!user) throw new BadRequestException('User not found!');
    const product = await this.productRepository.findOne(pid);
    if (!product) throw new BadRequestException('Product not found!');

    let order = await this.orderRepository.findOne({ where: { user } });
    // Check if user has an order
    if (order) {
      // State priority: 2, 1, 0, 3
      let state = 2;
      let op;

      while (!op) {
        const orders = await this.orderRepository.find({
          where: { user, orderState: state },
          relations: ['orderState'],
        });
        // Find the OrderProduct entry for the order containing product
        for (let i = 0; i < orders.length; i++) {
          op = await this.opRepository.findOne({
            where: { order: orders[i].id, product: product.id },
          });
          // If OrderProduct is found, set order value to return and break loop
          if (op) {
            order = orders[i];
            break;
          }
        }

        // Decrease state until it reaches 0, then change it to 3
        state += state === 0 ? 3 : -1;

        // state has returned to being 2, meaning all states have been checked and no
        // OrderProduct has been found
        if (state === 2) break;
      }
      if (!order || !op) return null;
      return order;
    }
    return null;
  }

  async getOrderStates() {
    return await this.osRepository.find();
  }
}
