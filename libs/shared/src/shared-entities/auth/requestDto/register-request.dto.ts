import { IsString, IsEmail, IsOptional, ValidateNested, IsEnum, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { GENDER } from '@app/shared/shared-entities/enums/gender.enum';


console.log('GENDER from shared:', GENDER, typeof GENDER);

class ProfileDto {
  @IsString()
  FirstName: string;

  @IsString()
  LastName: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsEnum(GENDER)
  gender: GENDER;

  @IsOptional()
  @IsString()
  CIN?: string;

  @Type(() => Date)  // ✅ Ajoutez cette ligne
  @IsDate()
  DOB: Date;
}

export class RegisterRequestDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  phone_number?: string;

  @ValidateNested()
  @Type(() => ProfileDto)
  profile: ProfileDto;

  @IsOptional()
  @IsString()
  establishment_id?: string;
}
