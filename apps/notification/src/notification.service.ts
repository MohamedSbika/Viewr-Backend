import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RedisService } from '@app/shared';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UserAuth } from '@app/shared';

@Injectable()
export class NotificationService {
  constructor(
    private readonly redisService: RedisService,
    @InjectRepository(UserAuth)
    private readonly userRepository: Repository<UserAuth>,
  ) {}

  async verifyUserInEstablishment(userId: string, establishmentId: string): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['establishment'],
    });
    if (!user || !user.establishment) return false;
    return user.establishment.id === establishmentId;
  }

  async storeNotification(dto: CreateNotificationDto): Promise<{ success: boolean; message: string }> {
    const key = `notifications:${dto.establishmentId}`;
    const notification = {
      ...dto,
      createdAt: new Date().toISOString(),
    };
    await this.redisService.lpush(key, JSON.stringify(notification));
    return { success: true, message: 'Notification stored' };
  }
}
