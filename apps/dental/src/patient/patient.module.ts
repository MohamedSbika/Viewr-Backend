import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientController } from './patient.controller';
import { PatientService } from './patient.service';
import { DentalPatientEntity } from '../entities/dental-patient.entity';
import { LoggingModule } from '@app/shared/common/logging/logging.module';

@Module({
  imports: [TypeOrmModule.forFeature([DentalPatientEntity]),
LoggingModule],
  controllers: [PatientController],
  providers: [PatientService],
  exports: [PatientService],
})
export class PatientModule {}
