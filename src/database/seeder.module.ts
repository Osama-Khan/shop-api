import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from 'src/api/address/address.entity';
import { Category } from 'src/api/categories/categories.entity';
import { Favorite } from 'src/api/favorite/favorite.entity';
import { Highlight } from 'src/api/highlights/highlights.entity';
import { City } from 'src/api/location/city/city.entity';
import { Country } from 'src/api/location/country/country.entity';
import { State } from 'src/api/location/state/state.entity';
import { OrderProduct } from 'src/api/order/order-product/order-product.entity';
import { OrderState } from 'src/api/order/order-state/order-state.entity';
import { Order } from 'src/api/order/order.entity';
import { Permission } from 'src/api/permissions/permissions.entity';
import { ProductImage } from 'src/api/products/product-image/product-image.entity';
import { ProductRating } from 'src/api/products/product-rating/product-rating.entity';
import { Product } from 'src/api/products/products.entity';
import { Role } from 'src/api/roles/roles.entity';
import { Setting } from 'src/api/setting/setting.entity';
import { User } from 'src/api/users/users.entity';
import { db } from 'src/dbconfig';
import { LocationSeederModule } from './location/location-seeder.module';
import { OrderSeederModule } from './order/order-seeder.module';
import { RoleSeederModule } from './role/role-seeder.module';
import { UserSeederModule } from './user/user-seeder.module';

const seedEntities = [
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

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: db.servername,
      port: db.serverport,
      username: db.username,
      password: db.password,
      database: db.dbname,
      entities: seedEntities,
      synchronize: true,
    }),
    OrderSeederModule,
    LocationSeederModule,
    RoleSeederModule,
    UserSeederModule,
  ],
})
export class SeederModule {}
