import { Module } from '@nestjs/common';
import { FileLoggerService } from '@app/shared';
import { AppointementController } from './appointement.controller';
import { AppointementService } from './appointement.service';

@Module({
  controllers: [AppointementController],
  providers: [
    AppointementService,
    FileLoggerService,
  ],
  exports: [AppointementService],
})
export class AppointementModule {}