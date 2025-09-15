import { Appointment } from './appointement.entity';

export class Analysis {
  id: string;
  analysisName: string;
  tubeType: string;
  sampleType: string;
  category: string;
  notes: string;
  appointment: Appointment;
}
