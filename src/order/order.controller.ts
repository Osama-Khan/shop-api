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
} from '@nestjs/common';
import { FiltersValidationPipe } from 'src/shared/pipes/filters/filters-validation.pipe';
import { IncludesValidationPipe } from 'src/shared/pipes/filters/includes-validation.pipe';
import { LimitValidationPipe } from 'src/shared/pipes/filters/limit-validation.pipe';
import { OrderByValidationPipe } from 'src/shared/pipes/filters/orderby-validation.pipe';
import { OrderDirValidationPipe } from 'src/shared/pipes/filters/orderdir-validation.pipe';
import { Order } from './order.entity';
import { OrderService } from './order.service';

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
  getOrders(
    @Query('limit', new LimitValidationPipe())
    limit: number,
    @Query('include', new IncludesValidationPipe(Order.relations))
    include: string[],
    @Query(
      'orderBy',
      new OrderByValidationPipe(OrderController.validProperties),
    )
    orderBy: string,
    @Query('orderDirection', new OrderDirValidationPipe())
    orderDir: 'ASC' | 'DESC',
    @Query(
      'filters',
      new FiltersValidationPipe(OrderController.validProperties),
    )
    filters,
  ) {
    return this.orderService.findAll(
      limit,
      include,
      orderBy,
      orderDir,
      filters,
    );
  }

  @Get(':id')
  getOrder(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.findOne(id);
  }

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
