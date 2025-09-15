import { IsString, IsDateString, IsEnum, IsOptional, IsArray, IsObject } from 'class-validator';
import { GENDER } from '@app/shared';
import { INSURANCE } from '@app/shared';

export class PatientDentalResponseDto {
  @IsString()
  id: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  nationality: string;

  @IsString()
  city: string;

  @IsString()
  address: string;

  @IsEnum(GENDER)
  gender: GENDER;

  @IsString()
  cin: string;

  @IsDateString()
  dateOfBirth: Date;

  @IsEnum(INSURANCE)
  insuranceType: INSURANCE;

  @IsString()
  @IsOptional()
  insuranceId?: string;

  @IsString()
  phoneNumber: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  emergencyContact?: string;

  @IsString()
  @IsOptional()
  emergencyPhone?: string;

  @IsArray()
  @IsOptional()
  medicalHistory?: string[];

  @IsArray()
  @IsOptional()
  allergies?: string[];

  @IsArray()
  @IsOptional()
  medications?: string[];

  @IsObject()
  @IsOptional()
  dentalChart?: Record<string, any>; // JSON object for dental chart

  @IsArray()
  @IsOptional()
  appointments?: any[]; // DentalAppointment objects

  @IsDateString()
  createdAt: Date;

  @IsDateString()
  updatedAt: Date;
}
