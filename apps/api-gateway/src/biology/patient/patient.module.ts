import { forwardRef, Module } from '@nestjs/common';
import { PatientController } from './patient.controller';
import { patientService } from './patient.service';
import { FileLoggerService } from '@app/shared';
import { BiologyModule } from '../biology.module';

@Module({
    imports : [forwardRef(() => BiologyModule)],
  controllers: [PatientController],
  providers: [
    patientService,
    FileLoggerService,
  ],
  exports: [patientService],
})
export class PatientModule {}