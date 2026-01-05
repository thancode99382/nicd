import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConversationUserService } from './conversation-user.service';
import { ConversationUserController } from './conversation-user.controller';
import { ConversationUser } from './entities/conversation-user.entity';
import { UserModule } from '../user/user.module';
import { ConversationModule } from '../conversation/conversation.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ConversationUser]),
    UserModule,
    forwardRef(() => ConversationModule),
  ],
  controllers: [ConversationUserController],
  providers: [ConversationUserService],
  exports: [ConversationUserService],
})
export class ConversationUserModule {}
