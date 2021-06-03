import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { City } from 'src/location/city/city.entity';
import { State } from 'src/location/state/state.entity';
import { User } from 'src/users/users.entity';
import { AddressController } from './address.controller';
import { Address } from './address.entity';
import { AddressService } from './address.service';

@Module({
  imports: [TypeOrmModule.forFeature([Address, User, City, State])],
  providers: [AddressService],
  controllers: [AddressController],
})
export class AddressModule {}
