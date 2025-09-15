// dtos/patient-response.dto.ts
import { IsString, IsDateString, IsEnum } from 'class-validator';
import { GENDER } from '@app/shared';

export class PatientBiologyResponseDto {
  @IsString()
  id: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEnum(GENDER)
  gender: GENDER;

  @IsDateString()
  DOB: Date;

  @IsString()
  address: string;

  @IsString({ each: true })
  EducationDocUrl: string[];
}
