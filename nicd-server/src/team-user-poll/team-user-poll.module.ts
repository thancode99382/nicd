import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamUserPoll } from './entities/team-user-poll.entity';
import { TeamUserPollService } from './team-user-poll.service';
import { TeamUserPollController } from './team-user-poll.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TeamUserPoll])],
  controllers: [TeamUserPollController],
  providers: [TeamUserPollService],
  exports: [TeamUserPollService],
})
export class TeamUserPollModule {}
