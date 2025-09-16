import { APPSTATUS } from "@app/shared";
import { IsDateString, IsOptional, IsNotEmpty, IsEnum, IsString, IsArray, IsUUID } from "class-validator";

export class UpdateBiologyAppointmentDto {
    @IsDateString()
    @IsOptional()
    @IsNotEmpty()
    startTime: Date;

    // @IsDateString()
    // @IsNotEmpty()
    // endTime: Date;

    @IsEnum(APPSTATUS)
    @IsOptional()
    status?: APPSTATUS;


    // @IsOptional()
    // @IsNotEmpty()
    // notes?: string;

    @IsString()
    @IsOptional()
    @IsNotEmpty()
    patientID: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    paymentID: string;

    @IsArray()
    @IsUUID('all', { each: true })
    @IsOptional()
    testIDs?: string[];

    @IsOptional()
    @IsNotEmpty()
    analysis?: string;
}
