import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionAuth , RoleAuth, FeatureAuth ,RoleFeaturePermissionAuth  } from '@app/shared';
import { PermissionController } from './permission.controller';
import { PermissionService } from './permission.service';
import { LoggingModule } from '../logging/logging.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PermissionAuth, RoleAuth, FeatureAuth, RoleFeaturePermissionAuth]),
    LoggingModule
  ],
  controllers: [PermissionController],
  providers: [PermissionService],
  exports: [PermissionService]
})
export class PermissionModule {}