import { Test, TestingModule } from '@nestjs/testing';
import { TeamUserPollService } from './team-user-poll.service';

describe('TeamUserPollService', () => {
  let service: TeamUserPollService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TeamUserPollService],
    }).compile();

    service = module.get<TeamUserPollService>(TeamUserPollService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
