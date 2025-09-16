import { IsObject, IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class UpdateDentalChartDto {
  @IsObject()
  @IsNotEmpty()
  dentalChart: Record<string, any>;

  @IsString()
  @IsNotEmpty()
  dentistId: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
