import { SafePartialType as PartialType } from '@app/shared';
import { CreateDentalTransactionDto } from './create-transaction.dto';

export class UpdateTransactionDto extends PartialType(CreateDentalTransactionDto) {}
