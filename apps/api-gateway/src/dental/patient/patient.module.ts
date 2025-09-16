import { forwardRef, Module } from '@nestjs/common';
import { PatientController } from './patient.controller';
import { PatientService } from './patient.service';
import { FileLoggerService } from '@app/shared';
import { DentalModule } from '../dental.module';

@Module({
      imports : [forwardRef(() => DentalModule)],
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
