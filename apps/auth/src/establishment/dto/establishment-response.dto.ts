import { PlanResponseDto } from '../../plan/dto/plan-response.dto';

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
  planId?: string;
  plan?: PlanResponseDto;
  createdAt: Date;
  updatedAt: Date;
}