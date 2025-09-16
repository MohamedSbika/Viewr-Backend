import { forwardRef, Module } from '@nestjs/common';
import { PermissionController } from './permission.controller';
import { PermissionService } from './permission.service';
import { FileLoggerService } from '@app/shared';
import { AuthModule } from '../auth.module';

@Module({    
  imports: [forwardRef(() => AuthModule)], // <- forwardRef si AuthModule importe RoleModule

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