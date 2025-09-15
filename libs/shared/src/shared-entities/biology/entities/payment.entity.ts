import { paymentMethod } from '../Enums/paymentMethod.enum';
import { paymentStatus } from '../Enums/paymentStatus.enum';
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