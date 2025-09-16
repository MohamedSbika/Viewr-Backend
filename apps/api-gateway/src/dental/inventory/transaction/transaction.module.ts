import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { FileLoggerService } from '@app/shared';

@Module({
  controllers: [TransactionController],
  providers: [
    TransactionService,
    {
      provide: 'FileLogger',
      useClass: FileLoggerService,
    },
  ],
  exports: [TransactionService],
})
export class TransactionModule {}
