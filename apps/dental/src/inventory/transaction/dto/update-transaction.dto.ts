import { TransactionType } from '@app/shared';
import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsUUID } from 'class-validator';

export class UpdateTransactionDto {
    @IsOptional()
    @IsNotEmpty()
    @IsUUID()
    inventoryItemId: string;

    @IsOptional()
    @IsNotEmpty()
    @IsDateString()
    date: Date;

    @IsOptional()
    @IsNotEmpty()
    @IsEnum(TransactionType)
    type: TransactionType;

    @IsOptional()
    @IsNotEmpty()
    @IsNumber({ maxDecimalPlaces: 2 })
    @IsPositive()
    quantity: number;
}
