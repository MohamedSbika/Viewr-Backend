import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { FileLoggerService } from '@app/shared';

@Module({
  controllers: [TaskController],
  providers: [
    TaskService,
    {
      provide: 'FileLogger',
      useClass: FileLoggerService,
    },
  ],
  exports: [TaskService],
})
export class TaskModule {}
