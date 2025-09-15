import {
  IsUUID,
  IsDateString,
  IsInt,
  IsEnum,
  IsString,
  IsOptional,
  ValidateNested,
  IsObject,
} from 'class-validator';
import { LotStatus } from '@app/shared';
import { Type } from 'class-transformer';
import { CreateDentalSupplierDto } from '../supplier/create-supplier.dto';

export class CreateDDentalLotDto {
  @IsUUID()
  inventoryItemId: string;

  @IsOptional()
  @IsUUID()
  supplierId?: string;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => CreateDentalSupplierDto)
  newSupplier?: CreateDentalSupplierDto;

  @IsUUID()
  storageLocationId: string;

  @IsDateString()
  receiveDate: string;

  @IsDateString()
  expiryDate: string;

  @IsInt()
  quantity: number;

  @IsOptional()
  @IsDateString()
  lastCheckedDate?: string;

  @IsOptional()
  @IsDateString()
  lastUsedDate?: string;

  @IsOptional()
  @IsEnum(LotStatus)
  status?: LotStatus;

  @IsString()
  location: string;
}
