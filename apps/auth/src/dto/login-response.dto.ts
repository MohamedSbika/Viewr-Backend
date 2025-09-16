export class LoginResponseDto {
  access_token: string;
  refresh_token: string;
  user_token: string; // New token for user details with permissions
  user: {

    id: string;
    fullname: string;
    email: string;
    role: string;
    establishment?: {
      id: string;
      name: string;
     
    };
  };
}
