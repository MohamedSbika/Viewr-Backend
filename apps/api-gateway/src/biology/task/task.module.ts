import { Module } from '@nestjs/common';
import { FileLoggerService } from '@app/shared';
import { TaskController } from './task.controller';
import { taskService } from './task.service';

@Module({
  controllers: [TaskController],
  providers: [
    taskService,
    FileLoggerService,
  ],
  exports: [taskService],
})
export class taskModule {}