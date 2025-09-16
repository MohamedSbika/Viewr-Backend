import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeatureController } from './feature.controller';
import { FeatureService } from './feature.service';
import { FeatureAuth , UserAuth , RoleAuth , PermissionAuth ,RoleFeaturePermissionAuth  } from '@app/shared';
import { LoggingModule } from '../logging/logging.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([FeatureAuth, UserAuth, RoleAuth, PermissionAuth, RoleFeaturePermissionAuth]),
    LoggingModule
  ],
  controllers: [FeatureController],
  providers: [FeatureService],
  exports: [FeatureService]
})
export class FeatureModule {}
