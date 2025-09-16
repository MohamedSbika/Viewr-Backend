import { Module } from '@nestjs/common';
import { RoleApiController } from './role.controller';
import { RoleService } from './role.service';
import { FileLoggerService } from '@app/shared';

@Module({
  controllers: [RoleApiController],
  providers: [
    RoleService,
    {
      provide: 'FileLogger',
      useClass: FileLoggerService,
    },
  ],
  exports: [RoleService],
})
export class RoleModule {}