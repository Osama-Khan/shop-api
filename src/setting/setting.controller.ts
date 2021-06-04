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
} from '@nestjs/common';
import { FiltersValidationPipe } from 'src/shared/pipes/filters/filters-validation.pipe';
import { IncludesValidationPipe } from 'src/shared/pipes/filters/includes-validation.pipe';
import { LimitValidationPipe } from 'src/shared/pipes/filters/limit-validation.pipe';
import { OrderByValidationPipe } from 'src/shared/pipes/filters/orderby-validation.pipe';
import { OrderDirValidationPipe } from 'src/shared/pipes/filters/orderdir-validation.pipe';
import { Setting } from './setting.entity';
import { SettingService } from './setting.service';

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
  getSettings(
    @Query('limit', new LimitValidationPipe())
    limit: number,
    @Query('include', new IncludesValidationPipe(Setting.relations))
    include: string[],
    @Query(
      'orderBy',
      new OrderByValidationPipe(SettingController.validProperties),
    )
    orderBy: string,
    @Query('orderDirection', new OrderDirValidationPipe())
    orderDir: 'ASC' | 'DESC',
    @Query(
      'filters',
      new FiltersValidationPipe(SettingController.validProperties),
    )
    filters,
  ) {
    return this.settingService.findAll(
      limit,
      include,
      orderBy,
      orderDir,
      filters,
    );
  }

  @Get(':id')
  getSetting(@Param('id', ParseIntPipe) id: number) {
    return this.settingService.findOne(id);
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
