import { Test, TestingModule } from '@nestjs/testing';
import { TeamUserPollController } from './team-user-poll.controller';
import { TeamUserPollService } from './team-user-poll.service';

describe('TeamUserPollController', () => {
  let controller: TeamUserPollController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeamUserPollController],
      providers: [TeamUserPollService],
    }).compile();

    controller = module.get<TeamUserPollController>(TeamUserPollController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
