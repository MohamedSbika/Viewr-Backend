import { paymentMethod, paymentStatus } from '@app/shared';
import { IsNumber, IsOptional, IsNotEmpty, IsDateString, IsEnum } from 'class-validator';

export class UpdatePaymentDto {
    @IsNumber()
    @IsOptional()
    @IsNotEmpty()
    amount: number;

    @IsDateString()
    @IsOptional()
    @IsNotEmpty()
    paymentDate: Date;

    @IsNumber()
    @IsOptional()
    @IsNotEmpty()
    patientContribution: number;

    @IsNumber()
    @IsNotEmpty()
    @IsOptional()
    insuranceContribution: number;

    @IsEnum(paymentMethod)
    @IsOptional()
    method?: paymentMethod;

    @IsEnum(paymentStatus)
    @IsOptional()
    status?: paymentStatus;
}
