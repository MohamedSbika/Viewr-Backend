import { lotStatus } from '@app/shared';
import { IsDateString, IsDecimal, IsEnum, IsOptional, IsUUID } from 'class-validator';

export class UpdateLotResponseDto {
  @IsOptional()
  @IsDateString()
  receivedDate: Date;

  @IsOptional()
  @IsDateString()
  expiryDate: Date;

  @IsOptional()
  @IsDecimal()
  quantity: number;

  @IsOptional()
  @IsDateString()
  lastChecked: Date;

  @IsOptional()
  @IsEnum(lotStatus)
  status: lotStatus;

  @IsOptional()
  @IsUUID()
  inventoryItemId: string;

  @IsOptional()
  @IsUUID()
  supplierId: string;

  @IsOptional()
  @IsUUID()
  storageLocationId: string;
}
export class LotBiologyResponseDto {
  id: string;
  receivedDate: Date;
  expiryDate: Date;
  quantity: number;
  lastChecked: Date;
  status: lotStatus;

  inventoryItem: {
    id: string;
    name: string;
    category: string;
  };

  supplier: {
    id: string;
    name: string;
    // Add more fields if needed
  };

  storageLocation: {
    id: string;
    name: string;
    // Add more fields if needed
  };

  transactions?: {
    id: string;
    transactionDate: Date;
    transactionQuantity: number;
    transactionType: string;
  }[];
}
