import { Module } from '@nestjs/common';
import { PatientController } from './patient.controller';
import { PatientService } from './patient.service';
import { FileLoggerService } from '@app/shared';

@Module({
  controllers: [PatientController],
  providers: [
    PatientService,
    {
      provide: 'FileLogger',
      useClass: FileLoggerService,
    },
  ],
  exports: [PatientService],
})
export class PatientModule {}
