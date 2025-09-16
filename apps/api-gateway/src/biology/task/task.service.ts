
import { Injectable, Logger, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { CreateBiologyTaskDto } from '@app/shared';
import { UpdateBiologyTaskDto } from '@app/shared';
import { taskBiologyResponseDto } from '@app/shared';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class taskService {
  private readonly logger = new Logger(taskService.name);

  constructor(
    @Inject('BIOLOGY_SERVICE') private readonly bioClient: ClientProxy
  ) {
    this.logger.log('task Service initialized');
  }

  async create(createTaskDto: CreateBiologyTaskDto): Promise<taskBiologyResponseDto> {
    this.logger.log(`Sending request to create task: ${JSON.stringify(createTaskDto)}`);
    try {
      const newTask = await firstValueFrom(
        this.bioClient.send<taskBiologyResponseDto, CreateBiologyTaskDto>('task.create', createTaskDto)
      );
      this.logger.log(`Received response for task creation: ${JSON.stringify(newTask)}`);
      return newTask;
    } catch (error) {
      this.logger.error(`Error during task creation RPC call: ${error.message}`, error.stack);

      throw new HttpException(error.response || {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);

    }
  }

  async findAll(): Promise<taskBiologyResponseDto[]> {
    this.logger.log(`Sending request to fetch all task`);
    try {
      const task = await firstValueFrom(
        this.bioClient.send<taskBiologyResponseDto[], {}>('task.findAll', {})
      );
      this.logger.log(`Received response for fetching all tasks: ${task.length} found`);
      return task;
    } catch (error) {
      this.logger.error(`Error during fetch all tasks RPC call: ${error.message}`, error.stack);

      throw new HttpException(error.response || {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);

    }
  }
  async findById(id: string): Promise<taskBiologyResponseDto> {

    try {
      const task = await firstValueFrom(
        this.bioClient.send<taskBiologyResponseDto>('task.findOne', { id })
      );
      return task;

    } catch (error) {
      this.logger.error(`Error during fetch  task RPC call: ${error.message}`, error.stack);
      throw new HttpException(error.response || {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);

    }
  }
async updateTask(id: string , data : UpdateBiologyTaskDto): Promise<taskBiologyResponseDto> {
  console.log(data)
        try {
            const task = await firstValueFrom(
                this.bioClient.send<taskBiologyResponseDto>('task.update', { id,updateTaskDto:data })
            );
            return task;

        } catch (error) {
            this.logger.error(`Error during task patient RPC call: ${error.message}`, error.stack);
            throw new HttpException(error.response || {
              statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
              error: error.error,
              message: error.message
            }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
      
        }
    }
 async delete(id: string): Promise<taskBiologyResponseDto> {

        try {
            const task = await firstValueFrom(
                this.bioClient.send<taskBiologyResponseDto>('task.remove', { id })
            );
            return task;

        } catch (error) {
            this.logger.error(`Error during deleting task RPC call: ${error.message}`, error.stack);
            throw new HttpException(error.response || {
              statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
              error: error.error,
              message: error.message
            }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
      
        }
    }

}