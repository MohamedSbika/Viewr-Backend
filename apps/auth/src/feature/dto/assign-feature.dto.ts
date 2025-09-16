import { IsNotEmpty, IsUUID } from 'class-validator';

export class AssignFeatureDto {
  @IsNotEmpty()
  @IsUUID()
  featureId: string;

  @IsNotEmpty()
  @IsUUID()
  roleId: string;

  @IsNotEmpty()
  @IsUUID()
  permissionId: string;
}
