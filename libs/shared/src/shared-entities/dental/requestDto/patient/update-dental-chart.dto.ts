import { IsString, IsOptional, IsObject, IsArray, IsBoolean, IsEnum, IsDateString } from 'class-validator';

export class UpdateDentalChartDto {
  @IsString()
  @IsOptional()
  chartVersion?: string;

  @IsString()
  @IsOptional()
  dentistId?: string;

  @IsObject()
  @IsOptional()
  teeth?: Record<string, {
    toothNumber?: number;
    toothType?: 'incisor' | 'canine' | 'premolar' | 'molar' | 'wisdom';
    present?: boolean;
    conditions?: string[];
    surfaces?: {
      mesial?: string;
      distal?: string;
      buccal?: string;
      lingual?: string;
      occlusal?: string;
    };
    treatments?: {
      date: Date;
      treatment: string;
      dentistId: string;
      notes?: string;
    }[];
    xrayUrls?: string[];
    photos?: string[];
  }>;

  @IsObject()
  @IsOptional()
  generalOralHealth?: {
    gumCondition?: 'healthy' | 'gingivitis' | 'periodontitis';
    plaqueLevel?: 'low' | 'moderate' | 'high';
    tartar?: boolean;
    bleeding?: boolean;
    sensitivity?: boolean;
    orthodonticTreatment?: {
      current?: boolean;
      history?: string;
      appliances?: string[];
    };
  };

  @IsObject()
  @IsOptional()
  treatmentPlan?: {
    urgentTreatments?: string[];
    recommendedTreatments?: string[];
    preventiveCare?: string[];
    followUpDate?: Date;
  };

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  clinicalNotes?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  patientComplaints?: string[];
}
