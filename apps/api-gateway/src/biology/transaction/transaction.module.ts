import { Module } from '@nestjs/common';
import { FileLoggerService } from '@app/shared';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';

@Module({
  controllers: [TransactionController],
  providers: [
    TransactionService,
    FileLoggerService,
  ],
  exports: [TransactionService],
})
export class TransactionModule {}