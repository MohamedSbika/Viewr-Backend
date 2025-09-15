import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateBiologySupplierDto {
  @IsString()
  supplierName: string;

  @IsString()
  contactPersonName: string;

  @IsString()
  phone: string;

  @IsEmail()
  email: string;

  @IsString()
  adress: string;
}
