import { TransactionType } from '@app/shared';
import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsUUID } from 'class-validator';

export class UpdateTransactionDto {
    @IsNotEmpty()
    @IsOptional()
    @IsUUID()
    inventoryItemId: string;

    @IsNotEmpty()
    @IsOptional()
    @IsDateString()
    date: Date;

    @IsNotEmpty()
    @IsOptional()
    @IsEnum(TransactionType)
    type: TransactionType;

    @IsNotEmpty()
    @IsNumber({ maxDecimalPlaces: 2 })
    @IsPositive()
    @IsOptional()
    quantity: number;
}
