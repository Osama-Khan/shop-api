import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Thread } from './thread.entity';
import { ThreadController } from './thread.controller';
import { ThreadService } from './thread.service';

@Module({
  imports: [TypeOrmModule.forFeature([Thread])],
  controllers: [ThreadController],
  providers: [ThreadService],
})
export class ThreadModule {}
