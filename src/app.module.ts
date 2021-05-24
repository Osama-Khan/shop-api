import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
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
import { Address } from './address/address.entity';
import { OrderProduct } from './order-product/order-product.entity';

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
      ],
      synchronize: true,
    }),
    ProductsModule,
    CategoriesModule,
    UsersModule,
    RolesModule,
    PermissionsModule,
    AuthenticationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
