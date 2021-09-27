import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StateController } from './state.controller';
import { State } from './state.entity';
import { StateService } from './state.service';

@Module({
  imports: [TypeOrmModule.forFeature([State])],
  providers: [StateService],
  controllers: [StateController],
})
export class StateModule {}
