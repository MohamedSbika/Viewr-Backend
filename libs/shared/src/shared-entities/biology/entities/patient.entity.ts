import { GENDER } from '@app/shared';
import { INSURANCE } from '@app/shared';
import { Appointment } from './appointement.entity';

export class Patient {
  id: string;
  FirstName: string;
  LastName: string;
  Nationality: string;
  City: string;
  gender: GENDER;
  CIN: string;
  DOB: Date;
  insuranceType: INSURANCE;
  insuranceID: string;
  appointments: Appointment[];
}
