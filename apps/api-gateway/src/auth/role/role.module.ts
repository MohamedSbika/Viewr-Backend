import { forwardRef, Module } from '@nestjs/common';
import { RoleApiController } from './role.controller';
import { RoleService } from './role.service';
import { FileLoggerService } from '@app/shared';
import { AuthModule } from '../auth.module';

@Module({
    imports: [forwardRef(() => AuthModule)], // <- forwardRef si AuthModule importe RoleModule

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