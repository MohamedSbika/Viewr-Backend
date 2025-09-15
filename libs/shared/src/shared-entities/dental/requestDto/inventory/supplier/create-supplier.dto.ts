import { IsEmail, IsString } from 'class-validator';

export class CreateDentalSupplierDto {
  @IsString()
  name: string;

  @IsString()
  contactPersonName: string;

  @IsString()
  phone: string;

  @IsEmail()
  email: string;

  @IsString()
  address: string;
}
