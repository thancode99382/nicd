import { Module } from '@nestjs/common';
import { TeamUserService } from './team-user.service';
import { TeamUserController } from './team-user.controller';

@Module({
  controllers: [TeamUserController],
  providers: [TeamUserService],
})
export class TeamUserModule {}
