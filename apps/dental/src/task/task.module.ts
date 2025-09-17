import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { FileLoggerService1, Task } from '@app/shared';
import { LoggingModule } from '@app/shared/common/logging/logging.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task]),
    LoggingModule,
  ],
  controllers: [TaskController],
  providers: [TaskService ],
  exports: [TaskService],
})
export class TaskModule {}
