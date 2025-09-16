import { forwardRef, Module } from '@nestjs/common';
import { FileLoggerService } from '@app/shared';
import { AppointementController } from './appointement.controller';
import { AppointementService } from './appointement.service';
import { BiologyModule } from '../biology.module';

@Module({
    imports : [forwardRef(() => BiologyModule)],
  controllers: [AppointementController],
  providers: [
    AppointementService,
    FileLoggerService,
  ],
  exports: [AppointementService],
})
export class AppointementModule {}