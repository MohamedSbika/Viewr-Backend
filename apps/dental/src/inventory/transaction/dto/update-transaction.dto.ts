import { SafePartialType as PartialType } from '@app/shared';
import { CreateTransactionDto } from './create-transaction.dto';

export class UpdateTransactionDto extends PartialType(CreateTransactionDto) {}
