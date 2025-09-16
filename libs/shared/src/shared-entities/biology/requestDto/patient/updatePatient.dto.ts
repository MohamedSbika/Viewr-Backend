import { GENDER, INSURANCE } from "@app/shared";
import { IsString, IsOptional, IsNotEmpty, IsEnum, IsDateString } from "class-validator";


export class UpdateBiologyPatientDto {
    @IsString()
    @IsOptional()
    @IsNotEmpty()
    FirstName: string;

    @IsString()
    @IsOptional()
    @IsNotEmpty()
    LastName: string;

    @IsString()
    @IsOptional()
    @IsNotEmpty()
    Nationality: string;

    @IsString()
    @IsOptional()
    @IsNotEmpty()
    City: string;

    @IsString()
    @IsOptional()
    @IsNotEmpty()
    adress: string; // Note: Field is spelled "adress" not "address"

    @IsOptional()
    @IsEnum(GENDER)
    gender: GENDER;

    @IsString()
    @IsOptional()
    @IsNotEmpty()
    CIN: string; // Identity card number

    @IsOptional()
    @IsDateString()
    DOB: Date;

    @IsOptional()
    insuranceType: INSURANCE = INSURANCE.CNAM; // Default value

    @IsString()
    @IsOptional()
    insuranceID?: string;

}
