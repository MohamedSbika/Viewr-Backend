import { forwardRef, Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { FileLoggerService } from '@app/shared';
import { DentalModule } from '../dental.module';

@Module({
      imports : [forwardRef(() => DentalModule)],
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
