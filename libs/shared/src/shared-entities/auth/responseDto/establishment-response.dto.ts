export class EstablishmentResponseDto {
  id: string;
  name: string;
  description?: string;
  address?: string;
  longitude?: string;
  latitude?: string;
  phone?: string;
  email?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}