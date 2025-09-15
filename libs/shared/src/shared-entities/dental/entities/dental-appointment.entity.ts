import { DENTAL_APPOINTMENT_STATUS } from '../Enums/dental-appointment-status.enum';
import { DentalPatient } from './patient.entity';

export class DentalAppointment {
  id: string;
  startTime: Date;
  endTime: Date;
  status: DENTAL_APPOINTMENT_STATUS;
  appointmentType: string; // e.g., 'consultation', 'cleaning', 'filling', 'extraction'
  notes?: string;
  treatmentPlan?: string;
  diagnosis?: string;
  proceduresConducted?: string[];
  totalAmount?: number;
  paidAmount?: number;
  patient: DentalPatient;
  dentistId: string;
  roomNumber?: string;
  followUpRequired?: boolean;
  followUpDate?: Date;
  prescriptions?: string[];
  xrayUrls?: string[];
  dentalPhotos?: string[];
  createdAt: Date;
  updatedAt: Date;
}
