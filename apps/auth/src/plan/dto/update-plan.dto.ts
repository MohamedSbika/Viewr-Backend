import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class UpdatePlanDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsPositive()
  price: number;
}
