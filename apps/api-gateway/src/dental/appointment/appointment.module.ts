import { Module } from '@nestjs/common';
import { AppointmentController } from './appointment.controller';
import { AppointmentService } from './appointment.service';
import { FileLoggerService } from '@app/shared';

@Module({
  controllers: [AppointmentController],
  providers: [
    AppointmentService,
    {
      provide: 'FileLogger',
      useClass: FileLoggerService,
    },
  ],
  exports: [AppointmentService],
})
export class AppointmentModule {}
