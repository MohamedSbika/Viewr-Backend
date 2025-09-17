import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentController } from './appointment.controller';
import { AppointmentService } from './appointment.service';
import { DentalAppointmentEntity } from '../entities/dental-appointment.entity';
import { DentalPatientEntity } from '../entities/dental-patient.entity';
import { LoggingModule } from '@app/shared/common/logging/logging.module';

@Module({
  imports: [TypeOrmModule.forFeature([DentalAppointmentEntity, DentalPatientEntity]),
LoggingModule],
  controllers: [AppointmentController],
  providers: [AppointmentService],
  exports: [AppointmentService],
})
export class AppointmentModule {}
