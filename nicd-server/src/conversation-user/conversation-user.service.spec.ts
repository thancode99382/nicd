import { Test, TestingModule } from '@nestjs/testing';
import { ConversationUserService } from './conversation-user.service';

describe('ConversationUserService', () => {
  let service: ConversationUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConversationUserService],
    }).compile();

    service = module.get<ConversationUserService>(ConversationUserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
