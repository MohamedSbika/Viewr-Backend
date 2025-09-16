import { IsOptional, IsString, IsEmail, IsBoolean, ValidateNested, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { GENDER } from '@app/shared';

class UpdateProfileDto {
  @IsOptional()
  @IsString()
  FirstName?: string;

  @IsOptional()
  @IsString()
  LastName?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsEnum(GENDER)
  gender?: GENDER;

  @IsOptional()
  @IsString()
  CIN?: string;

  @IsOptional()
  DOB?: Date;
}

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone_number?: string;

  @IsOptional()
  @IsBoolean()
  is_verified?: boolean;

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateProfileDto)
  profile?: UpdateProfileDto;

  @IsOptional()
  @IsString()
  establishment_id?: string;
}
