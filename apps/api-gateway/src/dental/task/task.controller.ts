import { Controller, Get, Post, Body, Param, Put, Delete, Logger, Inject, Query, Req } from '@nestjs/common';
import type { Request } from 'express';
import { TaskService } from './task.service';
import { CreateDentalTaskDto } from '@app/shared';
import { UpdateTaskDto } from '@app/shared';
import { TaskResponseDto } from '@app/shared';
import { FileLoggerService } from '@app/shared';

@Controller('dentist/tasks')
export class TaskController {
  private readonly logger = new Logger(TaskController.name);

  constructor(
    private readonly taskService: TaskService,
    @Inject('FileLogger') private readonly fileLogger: FileLoggerService
  ) {
    this.logger.log('Task controller initialized');
  }

  /**
   * Creates a new task
   * @param {CreateDentalTaskDto} createTaskDto - The task data
   * @returns {Promise<TaskResponseDto>} Created task information
   */
  @Post()
  async createTask(@Body() createTaskDto: CreateDentalTaskDto, @Req() req: Request): Promise<TaskResponseDto> {
    const logMessage = `Creating task: ${createTaskDto.title}`;
    this.fileLogger.log(logMessage, 'task-create', TaskController.name);
    return this.taskService.createTask(createTaskDto, req);
  }

  /**
   * Gets all tasks
   * @returns {Promise<TaskResponseDto[]>} List of all tasks
   */
  @Get()
  async getAllTasks(@Req() req: Request): Promise<TaskResponseDto[]> {
    const logMessage = 'Getting all tasks';
    this.fileLogger.log(logMessage, 'task-findAll', TaskController.name);
    return this.taskService.getAllTasks(req);
  }

  /**
   * Gets a specific task by ID
   * @param {string} id - Task ID
   * @returns {Promise<TaskResponseDto>} The task details
   */
  @Get(':id')
  async getTaskById(@Param('id') id: string, @Req() req: Request): Promise<TaskResponseDto> {
    const logMessage = `Getting task with ID: ${id}`;
    this.fileLogger.log(logMessage, 'task-findOne', TaskController.name);
    return this.taskService.getTaskById(id, req);
  }

  /**
   * Updates a task
   * @param {string} id - Task ID
   * @param {UpdateTaskDto} updateTaskDto - Updated data
   * @returns {Promise<TaskResponseDto>} Updated task
   */
  @Put(':id')
  async updateTask(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Req() req: Request
  ): Promise<TaskResponseDto> {
    const logMessage = `Updating task with ID: ${id}`;
    this.fileLogger.log(logMessage, 'task-update', TaskController.name);
    return this.taskService.updateTask(id, updateTaskDto, req);
  }

  /**
   * Deletes a task
   * @param {string} id - Task ID
   * @returns {Promise<void>}
   */
  @Delete(':id')
  async deleteTask(@Param('id') id: string, @Req() req: Request): Promise<void> {
    const logMessage = `Deleting task with ID: ${id}`;
    this.fileLogger.log(logMessage, 'task-remove', TaskController.name);
    return this.taskService.deleteTask(id, req);
  }

  /**
   * Gets tasks by user
   * @param {string} userId - User ID
   * @returns {Promise<TaskResponseDto[]>} Tasks assigned to the specified user
   */
  @Get('user/:userId')
  async getTasksByUser(@Param('userId') userId: string, @Req() req: Request): Promise<TaskResponseDto[]> {
    const logMessage = `Getting tasks for user: ${userId}`;
    this.fileLogger.log(logMessage, 'task-findByUser', TaskController.name);
    return this.taskService.getTasksByUser(userId, req);
  }

  /**
   * Gets tasks by status
   * @param {string} status - Task status
   * @returns {Promise<TaskResponseDto[]>} Tasks with the specified status
   */
  @Get('status/:status')
  async getTasksByStatus(@Param('status') status: string, @Req() req: Request): Promise<TaskResponseDto[]> {
    const logMessage = `Getting tasks by status: ${status}`;
    this.fileLogger.log(logMessage, 'task-findByStatus', TaskController.name);
    return this.taskService.getTasksByStatus(status, req);
  }

  /**
   * Marks a task as completed
   * @param {string} id - Task ID
   * @returns {Promise<TaskResponseDto>} Completed task
   */
  @Post(':id/complete')
  async completeTask(@Param('id') id: string, @Req() req: Request): Promise<TaskResponseDto> {
    const logMessage = `Completing task with ID: ${id}`;
    this.fileLogger.log(logMessage, 'task-complete', TaskController.name);
    return this.taskService.completeTask(id, req);
  }
}
