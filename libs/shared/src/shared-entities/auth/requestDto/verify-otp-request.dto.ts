import {  IsString } from "class-validator";

export class VerifyOtpRequestDto {
  @IsString()
  userId: string;
}