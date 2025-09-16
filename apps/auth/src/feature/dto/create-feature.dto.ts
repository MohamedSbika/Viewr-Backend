import { IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateFeatureDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
