import { forwardRef, Module } from '@nestjs/common';
import { EstablishmentController } from './establishment.controller';
import { EstablishmentService } from './establishment.service';
import { FileLoggerService } from '@app/shared';
import { AuthModule } from '../auth.module';

@Module({
    imports: [forwardRef(() => AuthModule)], // <- permet de résoudre dépendances circulaires
  controllers: [EstablishmentController],
  providers: [
    EstablishmentService,
    FileLoggerService,
  ],
  exports: [EstablishmentService],
})
export class EstablishmentModule {}