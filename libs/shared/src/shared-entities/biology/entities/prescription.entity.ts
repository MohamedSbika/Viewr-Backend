import { Appointment } from '@app/shared';

export class prescription {
  id: string;
  docUrl: string;
  createdAt: Date;
  updatedAt: Date;
  appointment: Appointment;
}
