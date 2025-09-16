import { Module } from '@nestjs/common';
import { LotController } from './lot.controller';
import { LotService } from './lot.service';
import { FileLoggerService } from '@app/shared';

@Module({
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
