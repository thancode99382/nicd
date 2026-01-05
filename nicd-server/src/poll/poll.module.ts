import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Poll } from './entities/poll.entity';
import { PollService } from './poll.service';
import { PollController } from './poll.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Poll])],
  controllers: [PollController],
  providers: [PollService],
  exports: [PollService],
})
export class PollModule {}
