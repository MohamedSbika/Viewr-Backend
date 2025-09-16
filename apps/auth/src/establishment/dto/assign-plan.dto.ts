import { IsUUID, IsNotEmpty } from 'class-validator';

export class AssignPlanDto {
  @IsUUID()
  @IsNotEmpty()
  planId: string;
}
