import { IsString, IsDateString, IsEnum, IsOptional, IsNotEmpty, IsArray, IsUUID } from 'class-validator';
import { APPSTATUS } from '@app/shared';



export class CreateBiologyAppointmentDto {
    @IsDateString()
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
    @IsNotEmpty()
    patientID: string;

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



