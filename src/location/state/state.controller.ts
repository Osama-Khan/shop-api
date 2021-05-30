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
import { State } from './state.entity';
import { StateService } from './state.service';

@Controller({ path: '/states' })
export class StateController {
  constructor(private readonly stateService: StateService) {}

  static validProperties = [
    'id',
    'name',
    'createdAt',
    'deletedAt',
    'updatedAt',
  ];

  @Get()
  getStates(
    @Query('limit', new LimitValidationPipe())
    limit: number,
    @Query('include', new IncludesValidationPipe(State.relations))
    include: string[],
    @Query(
      'stateBy',
      new OrderByValidationPipe(StateController.validProperties),
    )
    stateBy: string,
    @Query('stateDirection', new OrderDirValidationPipe())
    stateDir: 'ASC' | 'DESC',
    @Query(
      'filters',
      new FiltersValidationPipe(StateController.validProperties),
    )
    filters,
  ) {
    return this.stateService.findAll(
      limit,
      include,
      stateBy,
      stateDir,
      filters,
    );
  }

  @Get(':id')
  getState(@Param('id', ParseIntPipe) id: number) {
    return this.stateService.findOne(id);
  }

  @Put()
  setState(@Body() state) {
    return this.stateService.insert(state);
  }

  @Delete(':id')
  removeState(@Param('id', ParseIntPipe) id: number) {
    return this.stateService.remove(id);
  }

  @Patch(':id')
  updateState(@Param('id', ParseIntPipe) id: number, @Body() state: State) {
    return this.stateService.update(id, state);
  }
}
