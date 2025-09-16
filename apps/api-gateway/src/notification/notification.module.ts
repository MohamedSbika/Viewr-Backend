import { forwardRef, Module } from '@nestjs/common';
//import { NotificationController } from './notification.controller';
//import { NotificationService } from './notification.service';
import { NotifGateway } from './notif.gateway';
import { FileLoggerService } from '@app/shared';
import { NotificationController } from './notification.controller';
import { AuthModule } from '../auth/auth.module';
import { microserviceProviders } from '../microservices.providers';

@Module({
    imports: [forwardRef(() => AuthModule)], // <-- forwardRef si AuthModule importe NotificationModule

  controllers: [NotificationController],
  providers: [NotifGateway, FileLoggerService,    ...microserviceProviders],
})
export class NotificationModule {}
