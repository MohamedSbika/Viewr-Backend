import { PartialType } from '@nestjs/mapped-types';
import { CreateDentalTransactionDto } from './create-transaction.dto';

export class UpdateTransactionDto extends PartialType(CreateDentalTransactionDto) {}
