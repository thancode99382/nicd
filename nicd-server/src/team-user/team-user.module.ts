import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamUser } from './entities/team-user.entity';
import { TeamUserService } from './team-user.service';
import { TeamUserController } from './team-user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TeamUser])],
  controllers: [TeamUserController],
  providers: [TeamUserService],
  exports: [TeamUserService],
})
export class TeamUserModule {}
