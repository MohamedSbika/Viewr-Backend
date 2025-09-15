import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class UpdateBiologyInventoryItemDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  unit?: string;

  @IsOptional()
  @IsString()
  storageCondition?: string;

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
