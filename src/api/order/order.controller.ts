import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { Order } from './order.entity';
import { OrderService } from './order.service';
import FindManyValidationPipe from 'src/shared/pipes/filters/find-many-validation.pipe';
import FindOneOptionsDTO from 'src/shared/models/find-one-options.dto';
import FindManyOptionsDTO from 'src/shared/models/find-many-options.dto';
import FindOneValidationPipe from 'src/shared/pipes/filters/find-one-validation.pipe';
import { AuthenticationGuard } from 'src/shared/guards/authentication.guard';
import { TokenToUserInterceptor } from 'src/shared/interceptors';

@Controller({ path: '/orders' })
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  static validProperties = [
    'id',
    'address',
    'user',
    'orderState',
    'createdAt',
    'deletedAt',
    'updatedAt',
  ];

  @Get()
  @UsePipes(
    new FindManyValidationPipe(
      OrderController.validProperties,
      Order.relations,
    ),
  )
  getOrders(@Query() options: FindManyOptionsDTO<Order>) {
    return this.orderService.findAll(options);
  }

  @Get('states')
  getOrderStates() {
    return this.orderService.getOrderStates();
  }

  @Get(':id')
  @UsePipes(
    new FindOneValidationPipe(OrderController.validProperties, Order.relations),
  )
  getOrder(
    @Param('id', ParseIntPipe) id: number,
    @Query() options: FindOneOptionsDTO<Order>,
  ) {
    return this.orderService.findOne(id, options);
  }

  @Get('detail/:id')
  getOrderProduct(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.getDetail(id);
  }

  // Checks if user has ordered a product
  @Get('user/:uid/product/:pid')
  getUserProduct(
    @Param('uid', ParseIntPipe) uid: number,
    @Param('pid', ParseIntPipe) pid: number,
  ) {
    return this.orderService.getUserProduct(uid, pid);
  }

  @UseGuards(new AuthenticationGuard())
  @UseInterceptors(new TokenToUserInterceptor())
  @Put()
  placeOrder(@Body() orderDetail) {
    return this.orderService.placeOrder(orderDetail);
  }

  @Delete(':id')
  removeOrder(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.remove(id);
  }

  @Patch(':id')
  updateOrder(@Param('id', ParseIntPipe) id: number, @Body() order: Order) {
    return this.orderService.update(id, order);
  }
}
