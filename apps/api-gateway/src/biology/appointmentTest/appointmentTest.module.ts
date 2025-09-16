import { Module } from '@nestjs/common';
import { FileLoggerService } from '@app/shared';
import { AppointmentTestController } from './appointmentTest.controller';
import { appointmentTestService } from './appointmentTest.service';

@Module({
  controllers: [AppointmentTestController],
  providers: [
    appointmentTestService,
    FileLoggerService,
  ],
  exports: [appointmentTestService],
})
export class appointmentTestModule {}