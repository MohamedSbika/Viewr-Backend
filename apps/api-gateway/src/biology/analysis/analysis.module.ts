import { forwardRef, Module } from '@nestjs/common';
import { FileLoggerService } from '@app/shared';
import { AnalysisController } from './analysis.controller';
import { AnalysisService } from './analysis.service';
import { BiologyModule } from '../biology.module';

@Module({
  imports : [forwardRef(() => BiologyModule)],
  controllers: [AnalysisController],
  providers: [
    AnalysisService,
    FileLoggerService,
  ],
  exports: [AnalysisService],
})
export class AnalysisModule {}