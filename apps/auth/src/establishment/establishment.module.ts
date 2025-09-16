import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstablishmentController } from './establishment.controller';
import { EstablishmentService } from './establishment.service';
import { EstablishmentAuth } from '@app/shared';
import { LoggingModule } from '../logging/logging.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([EstablishmentAuth]),
    LoggingModule
  ],
  controllers: [EstablishmentController],
  providers: [EstablishmentService],
  exports: [EstablishmentService],
})
export class EstablishmentModule {}