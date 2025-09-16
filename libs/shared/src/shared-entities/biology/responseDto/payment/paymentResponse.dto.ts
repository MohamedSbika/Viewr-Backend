import { paymentMethod } from '@app/shared';
import { paymentStatus } from '@app/shared';
import { AppointmenResponseDto } from '@app/shared'; // Adjust path

export class PaymentResponseDto {
  ID: string;
  amount: number;
  paymentDate: Date;
  patientContribution: number;
  insuranceContribution: number;
  method: paymentMethod;
  status: paymentStatus;
  appointments: AppointmenResponseDto[];
}
