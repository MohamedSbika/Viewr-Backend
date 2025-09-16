import { IsOptional, IsString, IsNotEmpty } from "class-validator";

export class UpdateAnalysisDto {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    analysisName: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    tubeType: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    sampleType: string;


    @IsOptional()
    @IsString()
    @IsNotEmpty()
    category: string;

    @IsOptional()
    @IsString()
    notes?: string;
}
