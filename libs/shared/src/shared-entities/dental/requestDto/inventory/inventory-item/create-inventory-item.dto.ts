import { IsString, IsEnum, IsOptional, IsBoolean } from 'class-validator';
import { InventoryItemCategory } from '@app/shared';
import { StorageCondition } from '@app/shared';

export class CreateDentalInventoryItemDto {
  @IsString()
  name: string;

  @IsEnum(InventoryItemCategory)
  category: InventoryItemCategory;

  @IsString()
  unit: string;

  @IsEnum(StorageCondition)
  storageCondition: StorageCondition;

  @IsOptional()
  @IsString()
  description?: string;

  @IsBoolean()
  isConsumable: boolean;

  @IsBoolean()
  isReusable: boolean;
}
