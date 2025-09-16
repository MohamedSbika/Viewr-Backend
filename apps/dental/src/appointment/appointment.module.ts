import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentController } from './appointment.controller';
import { AppointmentService } from './appointment.service';
import { DentalAppointmentEntity } from '../entities/dental-appointment.entity';
import { DentalPatientEntity } from '../entities/dental-patient.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DentalAppointmentEntity, DentalPatientEntity])],
  controllers: [AppointmentController],
  providers: [AppointmentService],
  exports: [AppointmentService],
})
export class AppointmentModule {}
