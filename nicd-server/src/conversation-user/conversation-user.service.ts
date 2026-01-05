import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { ConversationUser } from './entities/conversation-user.entity';
import { ApiResponseBuilder } from '../common/responses/api-response';
import {
  ConversationUserNotFoundException,
  UserAlreadyInConversationException,
} from './exceptions/conversation-user.exceptions';
import { UserService } from '../user/user.service';
import { UserNotFoundException } from '../user/exceptions/user.exceptions';

@Injectable()
export class ConversationUserService {
  constructor(
    @InjectRepository(ConversationUser)
    private readonly conversationUserRepository: Repository<ConversationUser>,
    private readonly userService: UserService,
  ) {}

  async addUserToConversation(userId: string, conversationId: string) {
    // Check if user exists
    const user = await this.userService.findByUserId(userId);
    if (!user) {
      throw new UserNotFoundException();
    }

    // Check if user is already in conversation
    const existingMember = await this.conversationUserRepository.findOne({
      where: { user_id: userId, conversation_id: conversationId },
    });

    if (existingMember) {
      throw new UserAlreadyInConversationException();
    }

    const conversationUser = this.conversationUserRepository.create({
      conversation_user_id: uuidv4(),
      user_id: userId,
      conversation_id: conversationId,
    });

    const savedConversationUser =
      await this.conversationUserRepository.save(conversationUser);

    return ApiResponseBuilder.created('User added to conversation', {
      conversation_user_id: savedConversationUser.conversation_user_id,
      user_id: savedConversationUser.user_id,
      conversation_id: savedConversationUser.conversation_id,
      created_at: savedConversationUser.created_at,
    });
  }

  async removeUserFromConversation(userId: string, conversationId: string) {
    const conversationUser = await this.conversationUserRepository.findOne({
      where: { user_id: userId, conversation_id: conversationId },
    });

    if (!conversationUser) {
      throw new ConversationUserNotFoundException();
    }

    await this.conversationUserRepository.delete({
      conversation_user_id: conversationUser.conversation_user_id,
    });

    return ApiResponseBuilder.ok('User removed from conversation');
  }

  async getUsersByConversationId(conversationId: string) {
    const conversationUsers = await this.conversationUserRepository.find({
      where: { conversation_id: conversationId },
      relations: ['user'],
    });

    const users = conversationUsers.map((cu) => ({
      user_id: cu.user.user_id,
      username: cu.user.username,
      image_url: cu.user.image_url,
      joined_at: cu.created_at,
    }));

    return ApiResponseBuilder.ok('Users retrieved successfully', users);
  }

  async isUserInConversation(
    userId: string,
    conversationId: string,
  ): Promise<boolean> {
    const member = await this.conversationUserRepository.findOne({
      where: { user_id: userId, conversation_id: conversationId },
    });
    return !!member;
  }
}
