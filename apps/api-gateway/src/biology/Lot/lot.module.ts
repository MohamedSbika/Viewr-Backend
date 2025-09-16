import { forwardRef, Module } from '@nestjs/common';
import { FileLoggerService } from '@app/shared';
import { LotController } from './lot.controller';
import { LotService } from './lot.service';
import { BiologyModule } from '../biology.module';

@Module({
    imports : [forwardRef(() => BiologyModule)],
  controllers: [LotController],
  providers: [
    LotService,
    FileLoggerService,
  ],
  exports: [LotService],
})
export class LotModule {}