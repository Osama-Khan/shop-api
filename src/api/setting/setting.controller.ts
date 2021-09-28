import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Put,
  Query,
  UsePipes,
} from '@nestjs/common';
import { Setting } from './setting.entity';
import { SettingService } from './setting.service';
import FindManyValidationPipe from 'src/api/shared/pipes/filters/find-many-validation.pipe';
import FindOneValidationPipe from 'src/api/shared/pipes/filters/find-one-validation.pipe';
import FindManyOptionsDTO from 'src/shared/models/find-many-options.dto';
import FindOneOptionsDTO from 'src/shared/models/find-one-options.dto';

@Controller({ path: '/settings' })
export class SettingController {
  constructor(private readonly settingService: SettingService) {}

  static validProperties = [
    'id',
    'user',
    'defaultAddress',
    'createdAt',
    'deletedAt',
    'updatedAt',
  ];

  @Get()
  @UsePipes(
    new FindManyValidationPipe(
      SettingController.validProperties,
      Setting.relations,
    ),
  )
  getSettings(@Query() options: FindManyOptionsDTO<Setting>) {
    return this.settingService.findAll(options);
  }

  @Get(':id')
  @UsePipes(
    new FindOneValidationPipe(
      SettingController.validProperties,
      Setting.relations,
    ),
  )
  getSetting(
    @Param('id', ParseIntPipe) id: number,
    @Query() options: FindOneOptionsDTO<Setting>,
  ) {
    return this.settingService.findOne(id, options);
  }

  @Put()
  setSetting(@Body() setting) {
    return this.settingService.insert(setting);
  }

  @Delete(':id')
  removeSetting(@Param('id', ParseIntPipe) id: number) {
    return this.settingService.remove(id);
  }

  @Patch(':id')
  updateSetting(
    @Param('id', ParseIntPipe) id: number,
    @Body() setting: Setting,
  ) {
    return this.settingService.update(id, setting);
  }
}
