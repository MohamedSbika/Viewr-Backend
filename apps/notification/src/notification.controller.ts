import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Controller()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @MessagePattern('notification.verify-user-establishment')
  async verifyUserEstablishment(data: { userId: string; establishmentId: string }): Promise<{ valid: boolean }> {
    const valid = await this.notificationService.verifyUserInEstablishment(data.userId, data.establishmentId);
    return { valid };
  }

  @MessagePattern('notification.store')
  async storeNotification(data: CreateNotificationDto): Promise<{ success: boolean; message: string }> {
    return this.notificationService.storeNotification(data);
  }
}
