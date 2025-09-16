import { forwardRef, Module } from '@nestjs/common';
import { LotController } from './lot.controller';
import { LotService } from './lot.service';
import { FileLoggerService } from '@app/shared';
import { DentalModule } from '../../dental.module';

@Module({
      imports : [forwardRef(() => DentalModule)],
  
  controllers: [LotController],
  providers: [
    LotService,
    {
      provide: 'FileLogger',
      useClass: FileLoggerService,
    },
  ],
  exports: [LotService],
})
export class LotModule {}
