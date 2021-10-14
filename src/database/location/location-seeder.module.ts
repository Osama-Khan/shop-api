import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { City } from 'src/api/location/city/city.entity';
import { CityService } from 'src/api/location/city/city.service';
import { Country } from 'src/api/location/country/country.entity';
import { CountryService } from 'src/api/location/country/country.service';
import { State } from 'src/api/location/state/state.entity';
import { StateService } from 'src/api/location/state/state.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([City, State, Country]),
  ],
  providers: [CityService, StateService, CountryService],
})
export class LocationSeederModule {}
