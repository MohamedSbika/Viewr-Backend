import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsDateString } from 'class-validator';
import { paymentMethod } from '../../Enums/paymentMethod.enum';
import { paymentStatus } from '../../Enums/paymentStatus.enum'
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
