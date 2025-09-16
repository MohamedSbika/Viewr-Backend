import { SafePartialType as PartialType } from '@app/shared';
import { CreatePaymentDto } from '../payment/createPayment.dto';

export class UpdatePaymentDto extends PartialType(CreatePaymentDto) {}
