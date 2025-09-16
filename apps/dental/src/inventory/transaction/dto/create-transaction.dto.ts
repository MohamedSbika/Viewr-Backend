import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsUUID,
  IsDateString,
} from 'class-validator';
import { TransactionType } from '@app/shared';

export class CreateTransactionDto {
  @IsNotEmpty()
  @IsUUID()
  inventoryItemId: string;

  @IsNotEmpty()
  @IsDateString()
  date: Date;

  @IsNotEmpty()
  @IsEnum(TransactionType)
  type: TransactionType;

  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  quantity: number;
}
