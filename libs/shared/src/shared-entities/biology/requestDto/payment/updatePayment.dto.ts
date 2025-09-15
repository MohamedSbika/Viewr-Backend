import { PartialType } from '@nestjs/mapped-types';
import { CreatePaymentDto } from '../payment/createPayment.dto';

export class UpdatePaymentDto extends PartialType(CreatePaymentDto) {}
