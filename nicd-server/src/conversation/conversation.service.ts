import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Conversation } from './entities/conversation.entity';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { ApiResponseBuilder } from '../common/responses/api-response';
import { ConversationNotFoundException } from './exceptions/conversation.exceptions';
import { ConversationUserService } from '../conversation-user/conversation-user.service';

@Injectable()
export class ConversationService {
  constructor(
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,
    @Inject(forwardRef(() => ConversationUserService))
    private readonly conversationUserService: ConversationUserService,
  ) {}

  async createConversation(
    createConversationDto: CreateConversationDto,
    creatorUserId: string,
  ) {
    const conversation = this.conversationRepository.create({
      conversation_id: uuidv4(),
      conversation_name: createConversationDto.conversation_name,
      image_url: createConversationDto.image_url,
      team_id: createConversationDto.team_id,
    });

    const savedConversation =
      await this.conversationRepository.save(conversation);

    // Add creator as a member of the conversation
    await this.conversationUserService.addUserToConversation(
      creatorUserId,
      savedConversation.conversation_id,
    );

    return ApiResponseBuilder.created('Conversation created successfully', {
      conversation_id: savedConversation.conversation_id,
      conversation_name: savedConversation.conversation_name,
      image_url: savedConversation.image_url,
      team_id: savedConversation.team_id,
      created_at: savedConversation.created_at,
    });
  }

  async getConversationById(conversationId: string) {
    const conversation = await this.conversationRepository.findOne({
      where: { conversation_id: conversationId },
    });

    if (!conversation) {
      throw new ConversationNotFoundException();
    }

    return ApiResponseBuilder.ok(
      'Conversation retrieved successfully',
      conversation,
    );
  }

  async getConversationsByUserId(userId: string) {
    const conversations = await this.conversationRepository
      .createQueryBuilder('conversation')
      .innerJoin(
        'conversation.conversation_users',
        'cu',
        'cu.user_id = :userId',
        { userId },
      )
      .orderBy('conversation.updated_at', 'DESC')
      .getMany();

    return ApiResponseBuilder.ok(
      'Conversations retrieved successfully',
      conversations,
    );
  }

  async updateConversation(
    conversationId: string,
    updateConversationDto: UpdateConversationDto,
  ) {
    const conversation = await this.conversationRepository.findOne({
      where: { conversation_id: conversationId },
    });

    if (!conversation) {
      throw new ConversationNotFoundException();
    }

    await this.conversationRepository.update(
      { conversation_id: conversationId },
      updateConversationDto,
    );

    const updatedConversation = await this.conversationRepository.findOne({
      where: { conversation_id: conversationId },
    });

    return ApiResponseBuilder.ok(
      'Conversation updated successfully',
      updatedConversation,
    );
  }

  async deleteConversation(conversationId: string) {
    const conversation = await this.conversationRepository.findOne({
      where: { conversation_id: conversationId },
    });

    if (!conversation) {
      throw new ConversationNotFoundException();
    }

    await this.conversationRepository.delete({
      conversation_id: conversationId,
    });

    return ApiResponseBuilder.ok('Conversation deleted successfully');
  }

  async findById(conversationId: string): Promise<Conversation | null> {
    return this.conversationRepository.findOne({
      where: { conversation_id: conversationId },
    });
  }
}
