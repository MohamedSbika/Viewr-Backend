import { IsEmail, IsOptional, IsString } from "class-validator";

export class UpdateBiologySupplierDto {
    @IsString()
    supplierName: string;

    @IsString()
    contactPersonName: string;

    @IsString()
    phone: string;

    @IsEmail()
    email: string;

    @IsOptional()
    @IsString()
    adress: string;
}
