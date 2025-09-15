import { IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdatePrescriptionDto {
  @IsOptional()
  @IsString()
  @IsUrl()
  docUrl?: string;
}
