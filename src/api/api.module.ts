import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ApiController } from './api.controller';
import { CategoriesModule } from './categories/categories.module';
import { PermissionsModule } from './permissions/permissions.module';
import { ProductsModule } from './products/products.module';
import { RolesModule } from './roles/roles.module';
import { UsersModule } from './users/users.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { OrderModule } from './order/order.module';
import { CityModule } from './location/city/city.module';
import { StateModule } from './location/state/state.module';
import { CountryModule } from './location/country/country.module';
import { join } from 'path';
import { AddressModule } from './address/address.module';
import { SettingModule } from './setting/setting.module';
import { FavoriteModule } from './favorite/favorite.module';
import { ProductRatingModule } from './products/product-rating/product-rating.module';

@Module({
  imports: [
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
    FavoriteModule,
    ProductRatingModule,
  ],
  controllers: [ApiController],
})
export class ApiModule {}
