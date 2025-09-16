import { IsOptional, IsString, IsNotEmpty, IsEmail, IsBoolean } from "class-validator";

export class UpdateEstablishmentDto {
    @IsOptional()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    type: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional()
    address?: string;

    @IsString()
    @IsOptional()
    longitude?: string;

    @IsString()
    @IsOptional()
    latitude?: string;

    @IsString()
    @IsOptional()
    phone?: string;

    @IsEmail()
    @IsOptional()
    email?: string;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}