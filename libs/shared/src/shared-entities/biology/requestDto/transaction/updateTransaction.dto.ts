import { SafePartialType as PartialType } from '@app/shared';
import { CreateBiologyTransactionDto } from '../../requestDto/transaction/createTransaction.dto';

export class UpdateBiologyTransactionDto extends PartialType(CreateBiologyTransactionDto) {}
