import { DENTAL_APPOINTMENT_STATUS } from "@app/shared";
import { IsArray, IsBoolean, IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateAppointmentDto {
    @IsDateString()
    @IsOptional()
    @IsNotEmpty()
    startTime: Date;

    @IsDateString()
    @IsOptional()
    @IsNotEmpty()
    endTime: Date;

    @IsEnum(DENTAL_APPOINTMENT_STATUS)
    @IsOptional()
    status?: DENTAL_APPOINTMENT_STATUS = DENTAL_APPOINTMENT_STATUS.PENDING;

    @IsString()
    @IsOptional()
    @IsNotEmpty()
    appointmentType: string; // e.g., 'consultation', 'cleaning', 'filling', 'extraction'

    @IsString()
    @IsOptional()
    notes?: string;

    @IsString()
    @IsOptional()
    treatmentPlan?: string;

    @IsString()
    @IsOptional()
    diagnosis?: string;

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    proceduresConducted?: string[];

    @IsNumber()
    @IsOptional()
    totalAmount?: number;

    @IsNumber()
    @IsOptional()
    paidAmount?: number;

    @IsString()
    @IsOptional()
    @IsNotEmpty()
    patientId: string; // Reference to patient

    @IsString()
    @IsOptional()
    @IsNotEmpty()
    dentistId: string;

    @IsString()
    @IsOptional()
    roomNumber?: string;

    @IsBoolean()
    @IsOptional()
    followUpRequired?: boolean;

    @IsDateString()
    @IsOptional()
    followUpDate?: Date;

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    prescriptions?: string[];

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    xrayUrls?: string[];

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    dentalPhotos?: string[];
}
