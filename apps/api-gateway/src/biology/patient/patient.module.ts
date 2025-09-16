import { Module } from '@nestjs/common';
import { PatientController } from './patient.controller';
import { patientService } from './patient.service';
import { FileLoggerService } from '@app/shared';

@Module({
  controllers: [PatientController],
  providers: [
    patientService,
    FileLoggerService,
  ],
  exports: [patientService],
})
export class PatientModule {}