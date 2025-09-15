import { IsEnum, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { transactionType } from '@app/shared';

export class CreateBiologyTransactionDto {
  @IsUUID()
  lotId: string;

  @IsNumber()
  transactionQuantity: number;

  @IsString()
  notes: string;

  @IsEnum(transactionType)
  transaction: transactionType;
}
