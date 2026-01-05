import { Module } from '@nestjs/common';
import { TeamUserPollService } from './team-user-poll.service';
import { TeamUserPollController } from './team-user-poll.controller';

@Module({
  controllers: [TeamUserPollController],
  providers: [TeamUserPollService],
})
export class TeamUserPollModule {}
