import { forwardRef, Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { FileLoggerService } from '@app/shared';
import { DentalModule } from '../../dental.module';

@Module({
      imports : [forwardRef(() => DentalModule)],
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
