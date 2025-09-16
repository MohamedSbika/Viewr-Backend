import { Module } from '@nestjs/common';
import { EstablishmentController } from './establishment.controller';
import { EstablishmentService } from './establishment.service';
import { FileLoggerService } from '@app/shared';

@Module({
  controllers: [EstablishmentController],
  providers: [
    EstablishmentService,
    FileLoggerService,
  ],
  exports: [EstablishmentService],
})
export class EstablishmentModule {}