import { Test, TestingModule } from '@nestjs/testing';
import { ConversationUserController } from './conversation-user.controller';
import { ConversationUserService } from './conversation-user.service';

describe('ConversationUserController', () => {
  let controller: ConversationUserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConversationUserController],
      providers: [ConversationUserService],
    }).compile();

    controller = module.get<ConversationUserController>(ConversationUserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
