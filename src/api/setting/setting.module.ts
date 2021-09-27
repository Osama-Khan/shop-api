import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SettingController } from './setting.controller';
import { Setting } from './setting.entity';
import { SettingService } from './setting.service';

@Module({
  imports: [TypeOrmModule.forFeature([Setting])],
  providers: [SettingService],
  controllers: [SettingController],
})
export class SettingModule {}
