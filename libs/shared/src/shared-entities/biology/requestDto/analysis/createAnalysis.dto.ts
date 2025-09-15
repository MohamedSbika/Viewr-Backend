// dtos/create-analysis.dto.ts

import {
    IsString,
    IsDateString,
    IsNotEmpty,
    IsOptional,
  } from 'class-validator';
  
  export class CreateAnalysisDto {
    @IsString()
    @IsNotEmpty()
    analysisName: string;
  
    @IsString()
    @IsNotEmpty()
    tubeType: string;
  
    @IsString()
    @IsNotEmpty()
    sampleType: string;
  
  
    @IsString()
    @IsNotEmpty()
    category: string;
  
    @IsOptional()
    @IsString()
    notes?: string;
  }
  