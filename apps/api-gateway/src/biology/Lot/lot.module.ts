import { Module } from '@nestjs/common';
import { FileLoggerService } from '@app/shared';
import { LotController } from './lot.controller';
import { LotService } from './lot.service';

@Module({
  controllers: [LotController],
  providers: [
    LotService,
    FileLoggerService,
  ],
  exports: [LotService],
})
export class LotModule {}