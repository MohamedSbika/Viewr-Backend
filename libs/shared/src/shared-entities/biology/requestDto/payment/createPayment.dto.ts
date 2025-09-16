import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsDateString } from 'class-validator';
import { paymentMethod } from '@app/shared';
import { paymentStatus } from '@app/shared'
export class CreatePaymentDto {
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsDateString()
  @IsNotEmpty()
  paymentDate: Date;

  @IsNumber()
  @IsNotEmpty()
  patientContribution: number;

  @IsNumber()
  @IsNotEmpty()
  insuranceContribution: number;

  @IsEnum(paymentMethod)
  @IsOptional()
  method?: paymentMethod;

  @IsEnum(paymentStatus)
  @IsOptional()
  status?: paymentStatus;
}
