export class LoginResponseDto {
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
    email: string;
    role: string;
    features: string[];
    establishment?: {
      id: string;
      name: string;
      description?: string;
      address?: string;
      phone?: string;
      email?: string;
    }
  }
}