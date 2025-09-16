import { GENDER, INSURANCE } from "@app/shared";
import { IsArray, IsDateString, IsEmail, IsEnum, IsNotEmpty, IsObject, IsOptional, IsString } from "class-validator";

export class UpdatePatientDto {
    @IsString()
    @IsOptional()
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @IsOptional()
    @IsNotEmpty()
    lastName: string;

    @IsString()
    @IsOptional()
    @IsNotEmpty()
    nationality: string;

    @IsString()
    @IsOptional()
    @IsNotEmpty()
    city: string;

    @IsString()
    @IsOptional()
    @IsNotEmpty()
    address: string;

    @IsOptional()
    @IsEnum(GENDER)
    gender: GENDER;

    @IsString()
    @IsOptional()
    @IsNotEmpty()
    cin: string; // Identity card number

    @IsOptional()
    @IsDateString()
    dateOfBirth: Date;

    @IsEnum(INSURANCE)
    @IsOptional()
    insuranceType?: INSURANCE = INSURANCE.CNAM; // Default value

    @IsString()
    @IsOptional()
    insuranceId?: string;

    @IsString()
    @IsOptional()
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
    dentalChart?: Record<string, any>; // JSON object for dental chart
}
