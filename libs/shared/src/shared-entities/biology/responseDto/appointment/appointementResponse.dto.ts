import { IsString, IsDateString, IsEnum, IsOptional, IsNotEmpty, isNotEmpty } from 'class-validator';
import { APPSTATUS } from '@app/shared';
import { Patient } from '@app/shared/shared-entities';
import { AppointmentTest } from '@app/shared/shared-entities';
import { Payment } from '@app/shared/shared-entities';
import { Analysis } from '@app/shared/shared-entities';

export class AppointmenResponseDto {
    @IsDateString()
    @IsNotEmpty()
    startTime: Date;

    // @IsDateString()
    // @IsNotEmpty()
    // endTime: Date;

    @IsEnum(APPSTATUS)
    @IsOptional() 
    status?: APPSTATUS;

    //  @IsOptional()
    // @IsNotEmpty()
    // notes?: string;
    
    @IsNotEmpty()
    patient:Patient;

    @IsNotEmpty()
    payment:Payment;

    @IsOptional()
    tests?: AppointmentTest[];

    @IsNotEmpty()
    analysis:Analysis;


}