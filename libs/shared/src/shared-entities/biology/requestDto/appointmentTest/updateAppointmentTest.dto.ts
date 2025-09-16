import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateAppointmentTestDto {
  @IsOptional()
  @IsString()
  id: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  name: string;


  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsOptional()
  @IsDateString()
  sampleDate: Date;

  @IsOptional()
  @IsDateString()
  resultDate: Date;
}
