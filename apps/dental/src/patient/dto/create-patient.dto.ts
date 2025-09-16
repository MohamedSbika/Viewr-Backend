import { IsString, IsDateString, IsEnum, IsOptional, IsNotEmpty, IsEmail, IsArray, IsObject } from 'class-validator';
import { GENDER } from '@app/shared';
import { INSURANCE } from '@app/shared';

export class CreatePatientDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  nationality: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsEnum(GENDER)
  gender: GENDER;

  @IsString()
  @IsNotEmpty()
  cin: string; // Identity card number

  @IsDateString()
  dateOfBirth: Date;

  @IsEnum(INSURANCE)
  @IsOptional()
  insuranceType?: INSURANCE = INSURANCE.CNAM; // Default value

  @IsString()
  @IsOptional()
  insuranceId?: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  emergencyContact?: string;

  @IsString()
  @IsOptional()
  emergencyPhone?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  medicalHistory?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  allergies?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  medications?: string[];

  @IsObject()
  @IsOptional()
  dentalChart?: Record<string, any>;
}
