import { IsNotEmpty, IsString, IsNumber, IsDateString } from 'class-validator';

export class CreateAppointmentTestDto {
  @IsString()
  id: string;
  @IsString()
  @IsNotEmpty()
  name: string;

 
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsDateString()
    sampleDate: Date;

    @IsDateString()
    resultDate: Date;
}
