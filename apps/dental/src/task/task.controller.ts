import { Controller, HttpStatus, NotFoundException } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { FileLoggerService, FileLoggerService1 } from '@app/shared';
import { TaskStatus } from '../Enums/task-status.enum';

@Controller()
export class TaskController {
  private readonly logFileName = 'task';

  /**
   * Safely extracts error message from unknown error type
   */
  private getErrorMessage(error: unknown): string {
    return error instanceof Error ? error.message : 'Unknown error';
  }

  /**
   * Safely extracts error stack from unknown error type
   */
  private getErrorStack(error: unknown): string | undefined {
    return error instanceof Error ? error.stack : undefined;
  }
  constructor(
    private readonly taskService: TaskService,
    private readonly logger: FileLoggerService1,
  ) {
    this.logger.setContext('TaskController');
    this.logger.setLogFileName(this.logFileName);
  }

  @MessagePattern('task.status')
  getStatus() {
    this.logger.log(
      'Getting task module status',
      this.logFileName,
      'getStatus',
    );
    return { status: 'active', message: 'Task module is running' };
  }

  @MessagePattern('task.create')
  async create(@Payload() createTaskDto: CreateTaskDto) {
    this.logger.log(
      `Creating new task: ${JSON.stringify(createTaskDto)}`,
      this.logFileName,
      'create',
    );

    try {
      return await this.taskService.create(createTaskDto);
    } catch (error) {
      const errorMessage = this.getErrorMessage(error);
      const errorStack = this.getErrorStack(error);
      this.logger.error(
        `Error creating task: ${errorMessage}`,
        errorStack,
      );
      throw new RpcException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Internal Server Error',
        message: errorMessage,
      });
    }
  }

  @MessagePattern('task.findAll')
  
  async findAll() {
    this.logger.log(
      'Retrieving all tasks',
      this.logFileName,
      'findAll',
    );

    try {

      return await this.taskService.findAll();
      
    } catch (error) {
      const errorMessage = this.getErrorMessage(error);
      const errorStack = this.getErrorStack(error);
      this.logger.error(
        `Error retrieving tasks: ${errorMessage}`,
        errorStack,
      );
      throw new RpcException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Internal Server Error',
        message: errorMessage,
      });
    }
  }
  @MessagePattern('task.findOne')
  async findOne(@Payload() id: string) {
    this.logger.log(
      `Retrieving task with ID: ${id}`,
      this.logFileName,
      'findOne',
    );

    try {
      return await this.taskService.findOne(id);
    } catch (error) {
      this.logger.error(
        `Error fetching task with ID ${id}: ${this.getErrorMessage(error)}`,
        this.logFileName,
        'findOne',
      );
      if (error instanceof NotFoundException) {
        throw new RpcException({
          statusCode: HttpStatus.NOT_FOUND,
          error: 'Not Found',
          message: error.message,
        });
      }
      throw new RpcException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Internal Server Error',
        message: this.getErrorMessage(error) || `Error fetching task with ID ${id}`,
      });
    }
  }

  @MessagePattern('task.findByUser')
  async findByUser(@Payload() data: { userId: string }) {
    this.logger.log(
      `Retrieving tasks for user: ${data.userId}`,
      this.logFileName,
      'findByUser',
    );

    try {
      return await this.taskService.findByUserId(data.userId);
    } catch (error) {
      const errorMessage = this.getErrorMessage(error);
      const errorStack = this.getErrorStack(error);
      this.logger.error(
        `Error retrieving tasks by user: ${errorMessage}`,
        errorStack,
      );
      throw new RpcException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Internal Server Error',
        message: errorMessage,
      });
    }
  }

  @MessagePattern('task.findByStatus')
  async findByStatus(@Payload() data: { status: TaskStatus }) {
    this.logger.log(
      `Retrieving tasks by status: ${data.status}`,
      this.logFileName,
      'findByStatus',
    );

    try {
      return await this.taskService.getTasksByStatus(data.status);
    } catch (error) {
      const errorMessage = this.getErrorMessage(error);
      const errorStack = this.getErrorStack(error);
      this.logger.error(
        `Error retrieving tasks by status: ${errorMessage}`,
        errorStack,
      );
      throw new RpcException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Internal Server Error',
        message: errorMessage,
      });
    }
  }

  @MessagePattern('task.update')
  async update(
    @Payload()
    data: {
      id: string;
      updateTaskDto: UpdateTaskDto;
    },
  ) {
    this.logger.log(
      `Updating task ${data.id}: ${JSON.stringify(data.updateTaskDto)}`,
      this.logFileName,
      'update',
    );

    try {
      return await this.taskService.update(data.id, data.updateTaskDto);
    } catch (error) {
      if (error instanceof NotFoundException) {
        const errorMessage = this.getErrorMessage(error);
        this.logger.warn(`Task not found for update: ${errorMessage}`);
        throw new RpcException({
          statusCode: HttpStatus.NOT_FOUND,
          error: 'Not Found',
          message: errorMessage,
        });
      }

      const errorMessage = this.getErrorMessage(error);
      const errorStack = this.getErrorStack(error);
      this.logger.error(
        `Error updating task: ${errorMessage}`,
        errorStack,
      );
      throw new RpcException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Internal Server Error',
        message: errorMessage,
      });
    }
  }

  @MessagePattern('task.complete')
  async complete(@Payload() data: { id: string }) {
    this.logger.log(
      `Marking task as completed with ID: ${data.id}`,
      this.logFileName,
      'complete',
    );

    try {
      return await this.taskService.markAsCompleted(data.id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        const errorMessage = this.getErrorMessage(error);
        this.logger.warn(`Task not found for completion: ${errorMessage}`);
        throw new RpcException({
          statusCode: HttpStatus.NOT_FOUND,
          error: 'Not Found',
          message: errorMessage,
        });
      }

      const errorMessage = this.getErrorMessage(error);
      const errorStack = this.getErrorStack(error);
      this.logger.error(
        `Error completing task: ${errorMessage}`,
        errorStack,
      );
      throw new RpcException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Internal Server Error',
        message: errorMessage,
      });
    }
  }
  @MessagePattern('task.remove')
  async remove(@Payload() id: string) {
    this.logger.log(
      `Removing task with ID: ${id}`,
      this.logFileName,
      'remove',
    );

    try {
      await this.taskService.remove(id);
      return { 
        success: true,
        message: `Task with ID ${id} deleted successfully` 
      };
    } catch (error) {
      this.logger.error(
        `Error removing task with ID ${id}: ${this.getErrorMessage(error)}`,
        this.logFileName,
        'remove',
      );
      if (error instanceof NotFoundException) {
        throw new RpcException({
          statusCode: HttpStatus.NOT_FOUND,
          error: 'Not Found',
          message: error.message,
        });
      }
      throw new RpcException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Internal Server Error',
        message: this.getErrorMessage(error) || `Error removing task with ID ${id}`,
      });
    }
  }
}
