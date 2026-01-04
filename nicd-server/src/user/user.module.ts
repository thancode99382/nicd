import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { SocialLinksModule } from '../social-links/social-links.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => SocialLinksModule),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
