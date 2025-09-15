import { IsString, IsDateString, IsEnum, IsOptional, IsArray, IsNumber, IsBoolean, IsObject } from 'class-validator';
import { DENTAL_APPOINTMENT_STATUS } from '@app/shared';

export class AppointmentResponseDto {
  @IsString()
  id: string;

  @IsDateString()
  startTime: Date;

  @IsDateString()
  endTime: Date;

  @IsEnum(DENTAL_APPOINTMENT_STATUS)
  status: DENTAL_APPOINTMENT_STATUS;

  @IsString()
  appointmentType: string; 

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
  @IsOptional()
  proceduresConducted?: string[];

  @IsNumber()
  @IsOptional()
  totalAmount?: number;

  @IsNumber()
  @IsOptional()
  paidAmount?: number;

  @IsObject()
  @IsOptional()
  patient?: {
    id: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email?: string;
  };

  @IsString()
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
  @IsOptional()
  prescriptions?: string[];

  @IsArray()
  @IsOptional()
  xrayUrls?: string[];

  @IsArray()
  @IsOptional()
  dentalPhotos?: string[];

  @IsDateString()
  createdAt: Date;

  @IsDateString()
  updatedAt: Date;
}
