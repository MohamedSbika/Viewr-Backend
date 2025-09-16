import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { FileLoggerService } from '@app/shared';
import { TaskStatus } from '../Enums/task-status.enum';
import { TaskPriority } from '../Enums/task-priority.enum';

@Injectable()
export class TaskService {
  private readonly logFileName = 'task';

  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    private readonly logger: FileLoggerService,
  ) {
    this.logger.setLogFileName(this.logFileName);
    this.logger.setContext('TaskService');
  }

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    this.logger.log(
      `Creating new task with title: ${createTaskDto.title}`,
      this.logFileName,
      'create',
    );

    const task = this.taskRepository.create({
      ...createTaskDto,
      deadline: new Date(createTaskDto.deadline),
    });

    const savedTask = await this.taskRepository.save(task);
    
    this.logger.log(
      `Task created successfully with ID: ${savedTask.id}`,
      this.logFileName,
      'create',
    );

    return savedTask;
  }

  async findAll(): Promise<Task[]> {
    this.logger.log('Retrieving all tasks', this.logFileName, 'findAll');
    const tasks = await this.taskRepository.find({
      order: { createdAt: 'DESC' },
    });
    this.logger.log(
      `Retrieved ${tasks.length} tasks`,
      this.logFileName,
      'findAll',
    );
    return tasks;
    
  }

  async findByUserId(userId: string): Promise<Task[]> {
    this.logger.log(
      `Retrieving tasks for user: ${userId}`,
      this.logFileName,
      'findByUserId',
    );
    return await this.taskRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Task> {
    this.logger.log(`Retrieving task with ID: ${id}`, this.logFileName, 'findOne');
    const task = await this.taskRepository.findOne({ where: { id } });
    
    if (!task) {
      this.logger.error(`Task with ID ${id} not found`, this.logFileName, 'findOne');
      throw new Error(`Task with ID ${id} not found`);
    }

    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    this.logger.log(`Updating task with ID: ${id}`, this.logFileName, 'update');
    
    const task = await this.findOne(id);
    
    const updateData: any = { ...updateTaskDto };
    
    if (updateTaskDto.deadline) {
      updateData.deadline = new Date(updateTaskDto.deadline);
    }
    
    if (updateTaskDto.completedAt) {
      updateData.completedAt = new Date(updateTaskDto.completedAt);
    }

    Object.assign(task, updateData);
    
    const updatedTask = await this.taskRepository.save(task);
    
    this.logger.log(
      `Task updated successfully with ID: ${updatedTask.id}`,
      this.logFileName,
      'update',
    );

    return updatedTask;
  }

  async remove(id: string): Promise<void> {
    this.logger.log(`Removing task with ID: ${id}`, this.logFileName, 'remove');
    
    const task = await this.findOne(id);
    await this.taskRepository.remove(task);
    
    this.logger.log(
      `Task removed successfully with ID: ${id}`,
      this.logFileName,
      'remove',
    );
  }

  async markAsCompleted(id: string): Promise<Task> {
    this.logger.log(
      `Marking task as completed with ID: ${id}`,
      this.logFileName,
      'markAsCompleted',
    );
    
    return await this.update(id, {
      status: TaskStatus.COMPLETED,
      completedAt: new Date().toISOString(),
      title: '',
      description: '',
      deadline: '',
      priority: TaskPriority.LOW,
      userId: ''
    });
  }

  async getTasksByStatus(status: TaskStatus): Promise<Task[]> {
    this.logger.log(
      `Retrieving tasks with status: ${status}`,
      this.logFileName,
      'getTasksByStatus',
    );
    
    return await this.taskRepository.find({
      where: { status },
      order: { createdAt: 'DESC' },
    });
  }
}
