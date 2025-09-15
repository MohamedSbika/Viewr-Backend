import { APPSTATUS } from '../Enums/appstatus.enum';
import { Patient } from './patient.entity';
import { AppointmentTest } from './appointmentTest.entity';
import { Payment } from './payment.entity';
import { Analysis } from './analysis.entity';

export class Appointment {
  id: string;
  startTime: Date;
  status: APPSTATUS;
  patient: Patient;
  tests: AppointmentTest[];
  payment: Payment;
  analysis: Analysis[];
}
