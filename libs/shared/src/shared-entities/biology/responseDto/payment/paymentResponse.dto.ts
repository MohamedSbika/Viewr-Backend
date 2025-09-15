import { paymentMethod } from '../../Enums/paymentMethod.enum';
import { paymentStatus } from '../../Enums/paymentStatus.enum';
import { AppointmenResponseDto } from '../appointment/appointementResponse.dto'; // Adjust path

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
