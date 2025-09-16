export class UserDto {
  id: string;
  email: string;
  phone_number?: string;
  is_verified: boolean;
  profile: {
    FirstName: string;
    LastName: string;
    address?: string;
    gender: string;
    CIN?: string;
    DOB: Date;
  };
  roles?: Array<{
    id: string;
    title: string;
  }>;
  establishment?: {
    id: string;
    name: string;
  };
}
