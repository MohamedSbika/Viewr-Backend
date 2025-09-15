import { IsString, IsUrl } from 'class-validator';

export class CreatePrescriptionDto {
  @IsString()
  @IsUrl()
  docUrl: string;
}
