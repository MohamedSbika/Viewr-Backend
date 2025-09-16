import { IsString, IsNotEmpty } from 'class-validator';

export class LogoutRequestDto {
  @IsString()
  @IsNotEmpty()
  access_token: string;
}
