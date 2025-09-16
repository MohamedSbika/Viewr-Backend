import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { taskService } from './task.service';
import { CreateBiologyTaskDto } from '@app/shared';
import { taskBiologyResponseDto } from '@app/shared';
import { UpdateBiologyTaskDto } from '@app/shared';

@Controller('bio/task')
export class TaskController {

  constructor(private readonly taskService: taskService) {}

  @Post()
  async createTask(@Body() createTaskDto: CreateBiologyTaskDto): Promise<taskBiologyResponseDto> {
    return this.taskService.create(createTaskDto);
  }

  @Get()
  async getAlltask(): Promise<taskBiologyResponseDto[]> {
    return this.taskService.findAll();
  }

  @Get(':id')
  async getTaskById(@Param('id') id: string): Promise<taskBiologyResponseDto> {
    return this.taskService.findById(id);
  }

  @Put(':id')
  async updateTask(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateBiologyTaskDto
  ): Promise<taskBiologyResponseDto> {
    return this.taskService.updateTask(id, updateTaskDto);
  }

  @Delete(':id')
  async DeleteTask(@Param('id') id: string): Promise<taskBiologyResponseDto> {
    return this.taskService.delete(id);
  }

}
