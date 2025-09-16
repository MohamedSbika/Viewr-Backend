import { Module } from '@nestjs/common';
import { FileLoggerService } from '@app/shared';
import { AnalysisController } from './analysis.controller';
import { AnalysisService } from './analysis.service';

@Module({
  controllers: [AnalysisController],
  providers: [
    AnalysisService,
    FileLoggerService,
  ],
  exports: [AnalysisService],
})
export class AnalysisModule {}