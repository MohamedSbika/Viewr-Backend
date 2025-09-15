import { IsString, IsOptional, IsDateString } from 'class-validator';

export class PatientSearchDto {
  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsOptional()
  cin?: string;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsDateString()
  @IsOptional()
  dateOfBirthFrom?: Date;

  @IsDateString()
  @IsOptional()
  dateOfBirthTo?: Date;
}
