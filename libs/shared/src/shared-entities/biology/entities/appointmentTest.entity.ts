import { Appointment } from './appointement.entity';

export class AppointmentTest {
  ID: string;
  name: string;
  description: string;
  price: number
  sampleDate: Date;
  resultDate: Date;
  appointments: Appointment[];
}
