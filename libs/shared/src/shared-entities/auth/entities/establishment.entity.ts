import { User } from './user.entity';

export class Establishment {
  id: string;
  name: string;
  description: string;
  address: string;
  longitude: string;
  latitude: string;
  phone: string;
  email: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  users: User[];
}