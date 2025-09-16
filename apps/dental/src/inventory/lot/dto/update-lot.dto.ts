import { CreateDentalSupplierDto, LotStatus} from '@app/shared';
import { IsDateString, IsEnum, IsInt, IsObject, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateLotDto {
  @IsOptional()
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

  @IsOptional()
  @IsUUID()
  storageLocationId: string;

  @IsOptional()
  @IsDateString()
  receiveDate: string;

  @IsOptional()
  @IsDateString()
  expiryDate: string;

  @IsOptional()
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


  @IsOptional()
  @IsString()
  location: string;
}
