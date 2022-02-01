import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from './api/address/address.entity';
import { ApiModule } from './api/api.module';
import { Category } from './api/categories/categories.entity';
import { db } from './dbconfig';
import { Favorite } from './api/favorite/favorite.entity';
import { Highlight } from './api/highlights/highlights.entity';
import { City } from './api/location/city/city.entity';
import { Country } from './api/location/country/country.entity';
import { State } from './api/location/state/state.entity';
import { OrderProduct } from './api/order/order-product/order-product.entity';
import { OrderState } from './api/order/order-state/order-state.entity';
import { Order } from './api/order/order.entity';
import { Permission } from './api/permissions/permissions.entity';
import { ProductImage } from './api/products/product-image/product-image.entity';
import { ProductRating } from './api/products/product-rating/product-rating.entity';
import { Product } from './api/products/products.entity';
import { Role } from './api/roles/roles.entity';
import { Setting } from './api/setting/setting.entity';
import { User } from './api/users/users.entity';
import { ChatModule } from './chat/chat.module';
import { Message } from './chat/repository/message/message.entity';
import { Thread } from './chat/repository/thread/thread.entity';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';

const apiEntities = [
  Product,
  ProductRating,
  ProductImage,
  Category,
  Highlight,
  User,
  Permission,
  Role,
  Order,
  Address,
  OrderProduct,
  OrderState,
  City,
  State,
  Country,
  Setting,
  Favorite,
];

const chatEntities = [Thread, Message];

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    TypeOrmModule.forRoot({
      type: db.type as any,
      host: db.servername,
      port: db.serverport,
      username: db.username,
      password: db.password,
      database: db.dbname,
      entities: [...apiEntities, ...chatEntities],
      synchronize: true,
    }),
    ApiModule,
    ChatModule,
  ],
})
export class AppModule {}
