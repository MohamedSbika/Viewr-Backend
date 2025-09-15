import { Appointment } from './appointement.entity';

export class prescription {
  id: string;
  docUrl: string;
  createdAt: Date;
  updatedAt: Date;
  appointment: Appointment;
}
