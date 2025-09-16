import { forwardRef, Module } from '@nestjs/common';
import { FileLoggerService } from '@app/shared';
import { TaskController } from './task.controller';
import { taskService } from './task.service';
import { BiologyModule } from '../biology.module';

@Module({
    imports : [forwardRef(() => BiologyModule)],
  controllers: [TaskController],
  providers: [
    taskService,
    FileLoggerService,
  ],
  exports: [taskService],
})
export class taskModule {}