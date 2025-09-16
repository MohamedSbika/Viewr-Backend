import { IsString, IsEnum, IsOptional, IsBoolean } from 'class-validator';
import { InventoryItemCategory } from '@app/shared';
import { StorageCondition } from '@app/shared';

export class UpdateInventoryItemDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(InventoryItemCategory)
  category?: InventoryItemCategory;

  @IsOptional()
  @IsString()
  unit?: string;

  @IsOptional()
  @IsEnum(StorageCondition)
  storageCondition?: StorageCondition;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isConsumable?: boolean;

  @IsOptional()
  @IsBoolean()
  isReusable?: boolean;
}
