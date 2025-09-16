import { forwardRef, Module } from '@nestjs/common';
import { FileLoggerService } from '@app/shared';
import { PaymentController } from './payment.controller';
import { paymentService } from './payment.service';
import { BiologyModule } from '../biology.module';

@Module({
    imports : [forwardRef(() => BiologyModule)],
  controllers: [PaymentController],
  providers: [
    paymentService,
    FileLoggerService,
  ],
  exports: [paymentService],
})
export class paymentModule {}