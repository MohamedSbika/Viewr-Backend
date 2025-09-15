import { lotStatus } from '@app/shared';
import {
    IsDateString,
    IsDecimal,
    IsEnum,
    IsString,
    IsUUID,
  } from 'class-validator';
  
  export class CreateBiologyLotDto {
    @IsDateString()
    receivedDate: Date;
  
    @IsDateString()
    expiryDate: Date;
  
    @IsDecimal()
    quantity: number;
  
    @IsDateString()
    lastChecked: Date;
  
   @IsEnum(lotStatus)
    status: lotStatus;
  
    @IsUUID()
    inventoryItemId: string;
  
    @IsUUID()
    supplierId: string;
  
    @IsUUID()
    storageLocationId: string;
  }
  