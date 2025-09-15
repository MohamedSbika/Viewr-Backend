// dtos/analysis-response.dto.ts
import { IsString, IsOptional } from 'class-validator';

export class AnalysisResponseDto {
  @IsString()
  id: string;
  @IsString()
  analysisName: string;

  @IsString()
  tubeType: string;

  @IsString()
  sampleType: string;

  @IsString()
  category: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
