import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Category } from './categories/categories.entity';
import { CategoriesModule } from './categories/categories.module';
import { db } from './dbconfig';
import { Highlight } from './highlights/highlights.entity';
import { Product } from './products/products.entity';
import { ProductsModule } from './products/products.module';
import { User } from './users/users.entity';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: db.servername,
      port: 3306,
      username: db.username,
      password: db.password,
      database: db.dbname,
      entities: [Product, Category, Highlight, User],
      synchronize: true,
    }),
    ProductsModule,
    CategoriesModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
