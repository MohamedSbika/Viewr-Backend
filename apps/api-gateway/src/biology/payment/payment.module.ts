import { Module } from '@nestjs/common';
import { FileLoggerService } from '@app/shared';
import { PaymentController } from './payment.controller';
import { paymentService } from './payment.service';

@Module({
  controllers: [PaymentController],
  providers: [
    paymentService,
    FileLoggerService,
  ],
  exports: [paymentService],
})
export class paymentModule {}