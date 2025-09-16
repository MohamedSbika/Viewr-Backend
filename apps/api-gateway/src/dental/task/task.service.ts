import { Injectable, Logger, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { Request } from 'express';
import { CreateDentalTaskDto } from '@app/shared';
import { UpdateTaskDto } from '@app/shared';
import { TaskResponseDto } from '@app/shared';
import { RabbitMQService } from '@app/shared';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  constructor(
    private readonly rabbitMQService: RabbitMQService
  ) {
    this.logger.log('Task Service initialized');
  }

  /**
   * Create a new task
   * @param {CreateDentalTaskDto} createTaskDto - Task data
   * @param {Request} req - Express request object containing headers
   * @returns {Promise<TaskResponseDto>} The created task
   */
  async createTask(createTaskDto: CreateDentalTaskDto, req: Request): Promise<TaskResponseDto> {
    try {
      this.logger.log(`Creating task: ${createTaskDto.title}`);
      
      const targetQueue = (req as any).targetQueue;
      this.logger.log(`Using queue: ${targetQueue} for task.create`);
      
      return await this.rabbitMQService.sendMessage(targetQueue, 'task.create', createTaskDto);
    } catch (error) {
      this.logger.error(`Error creating task: ${error.message}`, error.stack);
      throw new HttpException(error.response || {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Get all tasks
   * @param {Request} req - Express request object containing headers
   * @returns {Promise<TaskResponseDto[]>} List of all tasks
   */
  async getAllTasks(req: Request): Promise<TaskResponseDto[]> {
    try {
      this.logger.log('Getting all tasks');
      
      const targetQueue = (req as any).targetQueue;
      this.logger.log(`Using queue: ${targetQueue} for task.findAll`);
      
      return await this.rabbitMQService.sendMessage(targetQueue, 'task.findAll', {});
    } catch (error) {
      this.logger.error(`Error getting all tasks: ${error.message}`, error.stack);
      throw new HttpException(error.response || {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Get task by ID
   * @param {string} id - Task ID
   * @param {Request} req - Express request object containing headers
   * @returns {Promise<TaskResponseDto>} The task
   */
  async getTaskById(id: string, req: Request): Promise<TaskResponseDto> {
    try {
      this.logger.log(`Getting task with ID: ${id}`);
      
      const targetQueue = (req as any).targetQueue;
      this.logger.log(`Using queue: ${targetQueue} for task.findOne`);
      
      return await this.rabbitMQService.sendMessage(targetQueue, 'task.findOne', { id });
    } catch (error) {
      this.logger.error(`Error getting task by ID: ${error.message}`, error.stack);
      throw new HttpException(error.response || {
        statusCode: HttpStatus.NOT_FOUND,
        error: 'Not Found',
        message: `Task with ID ${id} not found`
      }, error.status || HttpStatus.NOT_FOUND);
    }
  }

  /**
   * Update task
   * @param {string} id - Task ID
   * @param {UpdateTaskDto} updateTaskDto - Updated data
   * @param {Request} req - Express request object containing headers
   * @returns {Promise<TaskResponseDto>} Updated task
   */
  async updateTask(id: string, updateTaskDto: UpdateTaskDto, req: Request): Promise<TaskResponseDto> {
    try {
      this.logger.log(`Updating task with ID: ${id}`);
      
      const targetQueue = (req as any).targetQueue;
      this.logger.log(`Using queue: ${targetQueue} for task.update`);
      
      return await this.rabbitMQService.sendMessage(targetQueue, 'task.update', { id, updateTaskDto });
    } catch (error) {
      this.logger.error(`Error updating task: ${error.message}`, error.stack);
      throw new HttpException(error.response || {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Delete task
   * @param {string} id - Task ID
   * @param {Request} req - Express request object containing headers
   * @returns {Promise<void>}
   */
  async deleteTask(id: string, req: Request): Promise<void> {
    try {
      this.logger.log(`Deleting task with ID: ${id}`);
      
      const targetQueue = (req as any).targetQueue;
      this.logger.log(`Using queue: ${targetQueue} for task.remove`);
      
      return await this.rabbitMQService.sendMessage(targetQueue, 'task.remove', { id });
    } catch (error) {
      this.logger.error(`Error deleting task: ${error.message}`, error.stack);
      throw new HttpException(error.response || {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Get tasks by user
   * @param {string} userId - User ID
   * @param {Request} req - Express request object containing headers
   * @returns {Promise<TaskResponseDto[]>} Tasks assigned to the specified user
   */
  async getTasksByUser(userId: string, req: Request): Promise<TaskResponseDto[]> {
    try {
      this.logger.log(`Getting tasks for user: ${userId}`);
      
      const targetQueue = (req as any).targetQueue;
      this.logger.log(`Using queue: ${targetQueue} for task.findByUser`);
      
      return await this.rabbitMQService.sendMessage(targetQueue, 'task.findByUser', { userId });
    } catch (error) {
      this.logger.error(`Error getting tasks by user: ${error.message}`, error.stack);
      throw new HttpException(error.response || {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Get tasks by status
   * @param {string} status - Task status
   * @param {Request} req - Express request object containing headers
   * @returns {Promise<TaskResponseDto[]>} Tasks with the specified status
   */
  async getTasksByStatus(status: string, req: Request): Promise<TaskResponseDto[]> {
    try {
      this.logger.log(`Getting tasks by status: ${status}`);
      
      const targetQueue = (req as any).targetQueue;
      this.logger.log(`Using queue: ${targetQueue} for task.findByStatus`);
      
      return await this.rabbitMQService.sendMessage(targetQueue, 'task.findByStatus', { status });
    } catch (error) {
      this.logger.error(`Error getting tasks by status: ${error.message}`, error.stack);
      throw new HttpException(error.response || {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Complete a task
   * @param {string} id - Task ID
   * @param {Request} req - Express request object containing headers
   * @returns {Promise<TaskResponseDto>} Completed task
   */
  async completeTask(id: string, req: Request): Promise<TaskResponseDto> {
    try {
      this.logger.log(`Completing task with ID: ${id}`);
      
      const targetQueue = (req as any).targetQueue;
      this.logger.log(`Using queue: ${targetQueue} for task.complete`);
      
      return await this.rabbitMQService.sendMessage(targetQueue, 'task.complete', { id });
    } catch (error) {
      this.logger.error(`Error completing task: ${error.message}`, error.stack);
      throw new HttpException(error.response || {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Example method showing how to use RabbitMQService for other operations
   * Get tasks with custom filtering via dynamic queue
   * @param {Request} req - Express request object containing headers
   * @param {any} filters - Filter criteria
   * @returns {Promise<TaskResponseDto[]>} Filtered tasks
   */
  async getTasksWithFilters(req: Request, filters: any): Promise<TaskResponseDto[]> {
    try {
      this.logger.log('Getting tasks with filters');
      
      const targetQueue = (req as any).targetQueue;
      this.logger.log(`Using queue: ${targetQueue} for task.findWithFilters`);
      
      return await this.rabbitMQService.sendMessage(targetQueue, 'task.findWithFilters', filters);
    } catch (error) {
      this.logger.error(`Error getting filtered tasks: ${error.message}`, error.stack);
      throw new HttpException(error.response || {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
