import { IsDateString, IsOptional, IsString, IsEnum } from 'class-validator';
import { DENTAL_APPOINTMENT_STATUS } from '@app/shared';

export class AppointmentSearchDto {
  @IsString()
  @IsOptional()
  patientId?: string;

  @IsString()
  @IsOptional()
  dentistId?: string;

  @IsEnum(DENTAL_APPOINTMENT_STATUS)
  @IsOptional()
  status?: DENTAL_APPOINTMENT_STATUS;

  @IsString()
  @IsOptional()
  appointmentType?: string;

  @IsDateString()
  @IsOptional()
  startDate?: Date;

  @IsDateString()
  @IsOptional()
  endDate?: Date;

  @IsString()
  @IsOptional()
  roomNumber?: string;
}
