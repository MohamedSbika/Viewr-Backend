import { GENDER } from '@app/shared';
import { INSURANCE } from '@app/shared';

export class DentalPatient {
  id: string;
  firstName: string;
  lastName: string;
  nationality: string;
  city: string;
  address: string;
  gender: GENDER;
  cin: string; // Identity card number
  dateOfBirth: Date;
  insuranceType: INSURANCE;
  insuranceId: string;
  phoneNumber: string;
  email?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  medicalHistory?: string[];
  allergies?: string[];
  medications?: string[];
  dentalChart: Record<string, any>; // JSON object for dental chart
  appointments?: any[]; // Will be populated with DentalAppointment objects
  createdAt: Date;
  updatedAt: Date;
}
