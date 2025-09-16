import { forwardRef, Module } from '@nestjs/common';
import { FileLoggerService } from '@app/shared';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { BiologyModule } from '../biology.module';

@Module({
    imports : [forwardRef(() => BiologyModule)],
  controllers: [TransactionController],
  providers: [
    TransactionService,
    FileLoggerService,
  ],
  exports: [TransactionService],
})
export class TransactionModule {}