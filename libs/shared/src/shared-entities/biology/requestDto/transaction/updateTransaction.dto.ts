import { transactionType } from '@app/shared';
import { IsEnum, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateBiologyTransactionDto  {
    @IsOptional()
    @IsUUID()
    lotId: string;

    @IsOptional()
    @IsNumber()
    transactionQuantity: number;

    @IsOptional()
    @IsString()
    notes: string;

    @IsOptional()
    @IsEnum(transactionType)
    transaction: transactionType;
}
