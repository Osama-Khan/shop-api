import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { CityController } from './city.controller';
import { City } from './city.entity';
import { CityService } from './city.service';

@Module({
  imports: [TypeOrmModule.forFeature([City])],
  providers: [CityService],
  controllers: [CityController],
})
export class CityModule {}
