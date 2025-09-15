import { IsString, IsBoolean } from 'class-validator';

export class CreateBiologyInventoryItemDto {
  @IsString()
  name: string;

  @IsString()
  category: string;

  @IsString()
  unit: string;

  @IsString()
  storageCondition: string;

  @IsString()
  description: string;

  @IsBoolean()
  isConsumable: boolean;

  
  @IsBoolean()
  isReusable: boolean;

}
