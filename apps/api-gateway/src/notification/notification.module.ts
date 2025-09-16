import { Module } from '@nestjs/common';
//import { NotificationController } from './notification.controller';
//import { NotificationService } from './notification.service';
import { NotifGateway } from './notif.gateway';
import { FileLoggerService } from '@app/shared';

@Module({
  controllers: [],
  providers: [NotifGateway, FileLoggerService],
})
export class NotificationModule {}
