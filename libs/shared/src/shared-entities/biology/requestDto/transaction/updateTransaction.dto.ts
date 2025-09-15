import { PartialType } from '@nestjs/mapped-types';
import { CreateBiologyTransactionDto } from '../../requestDto/transaction/createTransaction.dto';

export class UpdateBiologyTransactionDto extends PartialType(CreateBiologyTransactionDto) {}
