import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Setting } from './setting.entity';
import { ApiService } from 'src/shared/services/api.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SettingService extends ApiService<Setting> {
  constructor(
    @InjectRepository(Setting)
    settingRepository: Repository<Setting>,
  ) {
    super(settingRepository, Setting.relations);
  }
}
