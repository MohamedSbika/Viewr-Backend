import { forwardRef, Module } from '@nestjs/common';
import { FileLoggerService } from '@app/shared';
import { AppointmentTestController } from './appointmentTest.controller';
import { appointmentTestService } from './appointmentTest.service';
import { BiologyModule } from '../biology.module';

@Module({
    imports : [forwardRef(() => BiologyModule)],
  controllers: [AppointmentTestController],
  providers: [
    appointmentTestService,
    FileLoggerService,
  ],
  exports: [appointmentTestService],
})
export class appointmentTestModule {}