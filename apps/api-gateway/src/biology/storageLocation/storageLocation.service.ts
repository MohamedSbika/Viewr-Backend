import { Injectable, Logger, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { CreateBiologyStorageLocationDto } from '@app/shared';
import { UpdateBiologyStorageLocationDto } from '@app/shared';
import { StorageLocationBiologyResponseDto } from '@app/shared';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);

  constructor(
    @Inject('BIOLOGY_SERVICE') private readonly bioClient: ClientProxy
  ) {
    this.logger.log('Storage Service initialized');
  }

  async create(createStorage: CreateBiologyStorageLocationDto): Promise<StorageLocationBiologyResponseDto> {
    this.logger.log(`Sending request to create Storage: ${JSON.stringify(createStorage)}`);
    try {
      const newStorage = await firstValueFrom(
        this.bioClient.send<StorageLocationBiologyResponseDto, CreateBiologyStorageLocationDto>('storageLocation.create', createStorage)
      );
      this.logger.log(`Received response for Storage creation: ${JSON.stringify(newStorage)}`);
      return newStorage;
    } catch (error) {
      this.logger.error(`Error during Storage creation RPC call: ${error.message}`, error.stack);

      throw new HttpException(error.response || {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);

    }
  }

  async findAll(): Promise<StorageLocationBiologyResponseDto[]> {
    this.logger.log(`Sending request to fetch all Storage`);
    try {
      const Storage = await firstValueFrom(
        this.bioClient.send<StorageLocationBiologyResponseDto[], {}>('storageLocation.findAll', {})
      );
      this.logger.log(`Received response for fetching all Storage: ${Storage.length} found`);
      return Storage;
    } catch (error) {
      this.logger.error(`Error during fetch all Storage RPC call: ${error.message}`, error.stack);

      throw new HttpException(error.response || {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);

    }
  }
  async findById(id: string): Promise<StorageLocationBiologyResponseDto> {

    try {
      const Storage = await firstValueFrom(
        this.bioClient.send<StorageLocationBiologyResponseDto>('storageLocation.findOne', { id })
      );
      return Storage;

    } catch (error) {
      this.logger.error(`Error during fetch Storage RPC call: ${error.message}`, error.stack);
      throw new HttpException(error.response || {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);

    }
  }
async updateStorage(id: string , data : UpdateBiologyStorageLocationDto): Promise<StorageLocationBiologyResponseDto> {
  console.log(data)
        try {
            const Storage = await firstValueFrom(
                this.bioClient.send<StorageLocationBiologyResponseDto>('storageLocation.update', { id,updateStorage:data })
            );
            return Storage;

        } catch (error) {
            this.logger.error(`Error during task Storage RPC call: ${error.message}`, error.stack);
            throw new HttpException(error.response || {
              statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
              error: error.error,
              message: error.message
            }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
      
        }
    }
 async deleteStorage(id: string): Promise<StorageLocationBiologyResponseDto> {

        try {
            const Storage = await firstValueFrom(
                this.bioClient.send<StorageLocationBiologyResponseDto>('storageLocation.remove', { id })
            );
            return Storage;

        } catch (error) {
            this.logger.error(`Error during deleting Storage RPC call: ${error.message}`, error.stack);
            throw new HttpException(error.response || {
              statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
              error: error.error,
              message: error.message
            }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
      
        }
    }

}