import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Notification } from './entities/notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { ApiResponseBuilder } from '../common/responses/api-response';
import { NotificationNotFoundException } from './exceptions/notification.exceptions';
import { UserService } from '../user/user.service';
import { UserNotFoundException } from '../user/exceptions/user.exceptions';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    private readonly userService: UserService,
  ) {}

  async createNotification(createNotificationDto: CreateNotificationDto) {
    // Validate user exists
    const user = await this.userService.findByUserId(
      createNotificationDto.user_id,
    );
    if (!user) {
      throw new UserNotFoundException();
    }

    const notification = this.notificationRepository.create({
      notification_id: uuidv4(),
      description: createNotificationDto.description,
      user_id: createNotificationDto.user_id,
    });

    const savedNotification =
      await this.notificationRepository.save(notification);

    return ApiResponseBuilder.created('Notification created successfully', {
      notification_id: savedNotification.notification_id,
      description: savedNotification.description,
      user_id: savedNotification.user_id,
      created_at: savedNotification.created_at,
    });
  }

  async getNotificationsByUserId(userId: string) {
    const notifications = await this.notificationRepository.find({
      where: { user_id: userId },
      order: { created_at: 'DESC' },
    });

    return ApiResponseBuilder.ok(
      'Notifications retrieved successfully',
      notifications,
    );
  }

  async getNotificationById(notificationId: string) {
    const notification = await this.notificationRepository.findOne({
      where: { notification_id: notificationId },
    });

    if (!notification) {
      throw new NotificationNotFoundException();
    }

    return ApiResponseBuilder.ok(
      'Notification retrieved successfully',
      notification,
    );
  }

  async deleteNotification(notificationId: string, userId: string) {
    const notification = await this.notificationRepository.findOne({
      where: { notification_id: notificationId, user_id: userId },
    });

    if (!notification) {
      throw new NotificationNotFoundException();
    }

    await this.notificationRepository.delete({
      notification_id: notificationId,
    });

    return ApiResponseBuilder.ok('Notification deleted successfully');
  }

  async deleteAllNotifications(userId: string) {
    await this.notificationRepository.delete({ user_id: userId });

    return ApiResponseBuilder.ok('All notifications deleted successfully');
  }
}
