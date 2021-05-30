import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { State } from './state.entity';
import { ApiService } from 'src/shared/services/api.service';
import generateRO from 'src/shared/helpers/ro.helper';
import { Injectable } from '@nestjs/common';

@Injectable()
export class StateService extends ApiService<State> {
  constructor(
    @InjectRepository(State)
    stateRepository: Repository<State>,
  ) {
    super(stateRepository, generateRO, State.relations);
  }
}
