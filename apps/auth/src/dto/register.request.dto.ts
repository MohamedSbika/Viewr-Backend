import { GENDER } from '@app/shared';

export class RegisterRequestDto {
  email: string;
  password: string;
  phone_number?: string;
  profile: {
    FirstName: string;
    LastName: string;
    address?: string;
    gender: GENDER;
    CIN?: string;
    DOB: Date;
  };
  establishment_id?: string;
}
