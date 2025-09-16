import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateSupplierDto  {
    @IsString()
    @IsOptional()

    name: string;

    @IsString()
    @IsOptional()
    contactPersonName: string;

    @IsString()
    @IsOptional()
    phone: string;

    @IsOptional()
    @IsEmail()
    email: string;

    @IsOptional()
    @IsString()
    address: string;
}
