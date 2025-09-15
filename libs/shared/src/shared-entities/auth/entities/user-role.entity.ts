import { User } from './user.entity';
import { Role } from './role.entity';

export class UserRole {
  id: string;
  user: User;
  role: Role;
}