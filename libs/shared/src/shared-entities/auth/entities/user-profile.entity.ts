import { GENDER } from '@app/shared';
import { User } from './user.entity';

export class UserProfile {
  id: string;
  FirstName: string;
  LastName: string;
  address: string;
  gender: GENDER;
  CIN: string;
  DOB: Date;
  EducationDoc: string[];
  user: User;
}