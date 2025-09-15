import { Role } from './role.entity';
import { UserProfile } from './user-profile.entity';
import { Establishment } from './establishment.entity';

export class User {
  id: string;
  email: string;
  password: string;
  phone_number: string;
  is_verified: boolean;
  roles: Role[];
  profile: UserProfile;
  establishment: Establishment;
}