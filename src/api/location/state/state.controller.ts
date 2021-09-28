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
import { State } from './state.entity';
import { StateService } from './state.service';
import FindOneOptionsDTO from 'src/shared/models/find-one-options.dto';
import FindManyOptionsDTO from 'src/shared/models/find-many-options.dto';
import FindManyValidationPipe from 'src/api/shared/pipes/filters/find-many-validation.pipe';
import FindOneValidationPipe from 'src/api/shared/pipes/filters/find-one-validation.pipe';

@Controller({ path: '/states' })
export class StateController {
  constructor(private readonly stateService: StateService) {}

  static validProperties = [
    'id',
    'name',
    'country',
    'createdAt',
    'deletedAt',
    'updatedAt',
  ];

  @Get()
  @UsePipes(
    new FindManyValidationPipe(
      StateController.validProperties,
      State.relations,
    ),
  )
  getStates(@Query() options: FindManyOptionsDTO<State>) {
    return this.stateService.findAll(options);
  }

  @Get(':id')
  @UsePipes(
    new FindOneValidationPipe(StateController.validProperties, State.relations),
  )
  getState(
    @Param('id', ParseIntPipe) id: number,
    @Query() options: FindOneOptionsDTO<State>,
  ) {
    return this.stateService.findOne(id, options);
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
