import { IsString, IsDateString, IsEnum, IsOptional, IsNotEmpty, IsArray, IsNumber, IsBoolean } from 'class-validator';
import { DENTAL_APPOINTMENT_STATUS } from '@app/shared';

export class CreateDentalAppointmentDto {
  @IsDateString()
  @IsNotEmpty()
  startTime: Date;

  @IsDateString()
  @IsNotEmpty()
  endTime: Date;

  @IsEnum(DENTAL_APPOINTMENT_STATUS)
  @IsOptional()
  status?: DENTAL_APPOINTMENT_STATUS = DENTAL_APPOINTMENT_STATUS.PENDING;

  @IsString()
  @IsNotEmpty()
  appointmentType: string; // e.g., 'consultation', 'cleaning', 'filling', 'extraction'

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsOptional()
  treatmentPlan?: string;

  @IsString()
  @IsOptional()
  diagnosis?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  proceduresConducted?: string[];

  @IsNumber()
  @IsOptional()
  totalAmount?: number;

  @IsNumber()
  @IsOptional()
  paidAmount?: number;

  @IsString()
  @IsNotEmpty()
  patientId: string; // Reference to patient

  @IsString()
  @IsNotEmpty()
  dentistId: string;

  @IsString()
  @IsOptional()
  roomNumber?: string;

  @IsBoolean()
  @IsOptional()
  followUpRequired?: boolean;

  @IsDateString()
  @IsOptional()
  followUpDate?: Date;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  prescriptions?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  xrayUrls?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  dentalPhotos?: string[];
}
