import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateRoleDto {

  @IsNotEmpty()
  @IsString()
  title: string;
}