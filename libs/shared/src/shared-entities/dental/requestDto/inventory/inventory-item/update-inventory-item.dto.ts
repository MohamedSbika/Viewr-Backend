import { InventoryItemCategory, StorageCondition } from "@app/shared";
import { IsBoolean, IsEnum, IsOptional, IsString } from "class-validator";

export class UpdateInventoryItemDto  {

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsEnum(InventoryItemCategory)
  category: InventoryItemCategory;

  @IsOptional()
  @IsString()
  unit: string;

  @IsOptional()
  @IsEnum(StorageCondition)
  storageCondition: StorageCondition;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isConsumable: boolean;

  @IsOptional()
  @IsBoolean()
  isReusable: boolean;
}
