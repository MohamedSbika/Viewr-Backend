import { Module } from '@nestjs/common';
import { PermissionController } from './permission.controller';
import { PermissionService } from './permission.service';
import { FileLoggerService } from '@app/shared';

@Module({
  controllers: [PermissionController],
  providers: [
    PermissionService,
    {
      provide: 'FileLogger',
      useClass: FileLoggerService,
    },
  ],
  exports: [PermissionService],
})
export class PermissionModule {}