import { forwardRef, Module } from '@nestjs/common';
import { FeatureController } from './feature.controller';
import { FeatureService } from './feature.service';
import { FileLoggerService } from '@app/shared';
import { AuthService } from '../auth.service';
import { AuthModule } from '../auth.module';

@Module({
  imports: [
    forwardRef(() => AuthModule), // évite la dépendance circulaire si nécessaire
  ],  controllers: [FeatureController],
  providers: [
    FeatureService,
    FileLoggerService,
  ],
  exports: [FeatureService],
})
export class FeatureModule {}