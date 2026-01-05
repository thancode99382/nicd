import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Message } from './entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { ApiResponseBuilder } from '../common/responses/api-response';
import {
  MessageNotFoundException,
  NotMessageOwnerException,
} from './exceptions/message.exceptions';
import { Conversation } from '../conversation/entities/conversation.entity';
import { ConversationNotFoundException } from '../conversation/exceptions/conversation.exceptions';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,
  ) {}

  async createMessage(createMessageDto: CreateMessageDto, senderId: string) {
    // Check if conversation exists
    const conversation = await this.conversationRepository.findOne({
      where: { conversation_id: createMessageDto.conversation_id },
    });
    if (!conversation) {
      throw new ConversationNotFoundException();
    }

    const message = this.messageRepository.create({
      message_id: uuidv4(),
      content: createMessageDto.content,
      conversation_id: createMessageDto.conversation_id,
      sender_id: senderId,
    });

    const savedMessage = await this.messageRepository.save(message);

    return ApiResponseBuilder.created('Message sent successfully', {
      message_id: savedMessage.message_id,
      content: savedMessage.content,
      conversation_id: savedMessage.conversation_id,
      sender_id: savedMessage.sender_id,
      created_at: savedMessage.created_at,
    });
  }

  async getMessagesByConversationId(
    conversationId: string,
    limit = 50,
    offset = 0,
  ) {
    const messages = await this.messageRepository.find({
      where: { conversation_id: conversationId },
      relations: ['sender'],
      order: { created_at: 'ASC' },
      take: limit,
      skip: offset,
    });

    const formattedMessages = messages.map((msg) => ({
      message_id: msg.message_id,
      content: msg.content,
      sender_id: msg.sender_id,
      sender_username: msg.sender?.username,
      sender_image_url: msg.sender?.image_url,
      created_at: msg.created_at,
      updated_at: msg.updated_at,
    }));

    return ApiResponseBuilder.ok(
      'Messages retrieved successfully',
      formattedMessages,
    );
  }

  async getMessageById(messageId: string) {
    const message = await this.messageRepository.findOne({
      where: { message_id: messageId },
      relations: ['sender'],
    });

    if (!message) {
      throw new MessageNotFoundException();
    }

    return ApiResponseBuilder.ok('Message retrieved successfully', {
      message_id: message.message_id,
      content: message.content,
      conversation_id: message.conversation_id,
      sender_id: message.sender_id,
      sender_username: message.sender?.username,
      created_at: message.created_at,
      updated_at: message.updated_at,
    });
  }

  async updateMessage(
    messageId: string,
    updateMessageDto: UpdateMessageDto,
    userId: string,
  ) {
    const message = await this.messageRepository.findOne({
      where: { message_id: messageId },
    });

    if (!message) {
      throw new MessageNotFoundException();
    }

    if (message.sender_id !== userId) {
      throw new NotMessageOwnerException();
    }

    await this.messageRepository.update(
      { message_id: messageId },
      { content: updateMessageDto.content },
    );

    const updatedMessage = await this.messageRepository.findOne({
      where: { message_id: messageId },
    });

    return ApiResponseBuilder.ok('Message updated successfully', updatedMessage);
  }

  async deleteMessage(messageId: string, userId: string) {
    const message = await this.messageRepository.findOne({
      where: { message_id: messageId },
    });

    if (!message) {
      throw new MessageNotFoundException();
    }

    if (message.sender_id !== userId) {
      throw new NotMessageOwnerException();
    }

    await this.messageRepository.delete({ message_id: messageId });

    return ApiResponseBuilder.ok('Message deleted successfully');
  }
}
