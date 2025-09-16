import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { RedisModule } from '@app/shared';
import { UserAuth } from '@app/shared';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    RedisModule,
    TypeOrmModule.forFeature([UserAuth]), 
  ],
  providers: [NotificationService],
  controllers: [NotificationController],
})
export class NotificationModule {}
