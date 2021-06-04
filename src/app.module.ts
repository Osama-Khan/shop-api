import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Category } from './categories/categories.entity';
import { CategoriesModule } from './categories/categories.module';
import { db } from './dbconfig';
import { Highlight } from './highlights/highlights.entity';
import { Permission } from './permissions/permissions.entity';
import { PermissionsModule } from './permissions/permissions.module';
import { Product } from './products/products.entity';
import { ProductsModule } from './products/products.module';
import { Role } from './roles/roles.entity';
import { RolesModule } from './roles/roles.module';
import { User } from './users/users.entity';
import { UsersModule } from './users/users.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { Order } from './order/order.entity';
import { OrderModule } from './order/order.module';
import { Address } from './address/address.entity';
import { OrderProduct } from './order/order-product/order-product.entity';
import { OrderState } from './order/order-state/order-state.entity';
import { City } from './location/city/city.entity';
import { State } from './location/state/state.entity';
import { Country } from './location/country/country.entity';
import { CityModule } from './location/city/city.module';
import { StateModule } from './location/state/state.module';
import { CountryModule } from './location/country/country.module';
import { join } from 'path';
import { AddressModule } from './address/address.module';
import { SettingModule } from './setting/setting.module';
import { Setting } from './setting/setting.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: db.servername,
      port: 3306,
      username: db.username,
      password: db.password,
      database: db.dbname,
      entities: [
        Product,
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
      ],
      synchronize: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    ProductsModule,
    CategoriesModule,
    UsersModule,
    RolesModule,
    PermissionsModule,
    AuthenticationModule,
    OrderModule,
    CityModule,
    StateModule,
    CountryModule,
    AddressModule,
    SettingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
