import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConversationService } from './conversation.service';
import { ConversationController } from './conversation.controller';
import { Conversation } from './entities/conversation.entity';
import { ConversationUserModule } from '../conversation-user/conversation-user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Conversation]),
    forwardRef(() => ConversationUserModule),
  ],
  controllers: [ConversationController],
  providers: [ConversationService],
  exports: [ConversationService],
})
export class ConversationModule {}
