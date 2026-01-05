import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';
import { SocialLinksModule } from './social-links/social-links.module';
import { NotificationModule } from './notification/notification.module';
import { FeedbackModule } from './feedback/feedback.module';
import { ConversationModule } from './conversation/conversation.module';
import { MessageModule } from './message/message.module';
import { ConversationUserModule } from './conversation-user/conversation-user.module';
import { TeamModule } from './team/team.module';
import { TeamUserModule } from './team-user/team-user.module';
import { MatchModule } from './match/match.module';
import { PollModule } from './poll/poll.module';
import { TeamUserPollModule } from './team-user-poll/team-user-poll.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    UserModule,
    AuthModule,
    EmailModule,
    SocialLinksModule,
    NotificationModule,
    FeedbackModule,
    ConversationModule,
    ConversationUserModule,
    MessageModule,
    TeamModule,
    TeamUserModule,
    MatchModule,
    PollModule,
    TeamUserPollModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
