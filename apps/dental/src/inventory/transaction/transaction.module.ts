import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import {  Transaction } from '@app/shared';
import { Lot } from '@app/shared';
import { FileLoggerService } from '@app/shared';
import { LoggingModule } from '@app/shared/common/logging/logging.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction, Lot]),
    LoggingModule
    // LoggingModule is now available through parent InventoryModule
  ],
  controllers: [TransactionController],
  providers: [TransactionService, FileLoggerService],
  exports: [TransactionService],
})
export class TransactionModule {}
