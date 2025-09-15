// dtos/create-patient.dto.ts
import { IsString, IsDateString, IsEnum, IsOptional, IsNotEmpty, IsUUID } from 'class-validator';
import { GENDER } from '../../Enums/gender.enum';
import { INSURANCE } from '../../Enums/insurance.enum';

export class createPatientDto {

  @IsString()
  @IsNotEmpty()
  FirstName: string;

  @IsString()
  @IsNotEmpty()
  LastName: string;

  @IsString()
  @IsNotEmpty()
  Nationality: string;

  @IsString()
  @IsNotEmpty()
  City: string;

  @IsString()
  @IsNotEmpty()
  adress: string; // Note: Field is spelled "adress" not "address"

  @IsEnum(GENDER)
  gender: GENDER;

  @IsString()
  @IsNotEmpty()
  CIN: string; // Identity card number

  @IsDateString()
  DOB: Date;

  @IsOptional()
  insuranceType: INSURANCE = INSURANCE.CNAM; // Default value

  @IsString()
  @IsOptional()
  insuranceID?: string;

}
