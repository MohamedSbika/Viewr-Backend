import { InventoryItemCategory, StorageCondition } from '@app/shared';
import { IsString, IsBoolean, IsOptional, IsEnum } from 'class-validator';

export class UpdateBiologyInventoryItemDto {
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
