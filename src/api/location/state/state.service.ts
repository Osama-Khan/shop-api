import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { State } from './state.entity';
import { ApiService } from 'src/api/shared/services/api.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class StateService extends ApiService<State> {
  constructor(
    @InjectRepository(State)
    stateRepository: Repository<State>,
  ) {
    super(stateRepository, State.relations);
  }
}
