import { paymentMethod } from '@app/shared';
import { paymentStatus } from '@app/shared';
import { Appointment } from './appointement.entity';

export class Payment {
    ID: string;
    amount: number;
    paymentDate: Date;
    patientContribution: number;
    insuranceContribution: number;
    method: paymentMethod;
    status: paymentStatus;
    appointments: Appointment[];
}