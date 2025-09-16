import { Injectable, Logger, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { Request } from 'express';
import { CreateDentalStorageLocationDto } from '@app/shared';
import { UpdateDentalStorageLocationDto } from '@app/shared';
import { StorageLocationResponseDto } from '@app/shared';
import { RabbitMQService } from '@app/shared';

@Injectable()
export class StorageLocationService {
  private readonly logger = new Logger(StorageLocationService.name);

  constructor(
    @Inject('DENTIST_SERVICE') private readonly dentistClient: ClientProxy,
    private readonly rabbitMQService: RabbitMQService
  ) {
    this.logger.log('Storage Location Service initialized');
  }

  /**
   * Create a new storage location
   * @param {CreateDentalStorageLocationDto} createStorageLocationDto - Storage location data
   * @param {Request} request - Express request object containing headers
   * @returns {Promise<StorageLocationResponseDto>} The created storage location
   */
  async createStorageLocation(createStorageLocationDto: CreateDentalStorageLocationDto, request: Request): Promise<StorageLocationResponseDto> {
    try {
      this.logger.log(`Creating storage location: ${createStorageLocationDto.locationName}`);
      const targetQueue = (request as any).targetQueue;
      this.logger.log(`Using queue: ${targetQueue} for storageLocation.create`);
      
      return await this.rabbitMQService.sendMessage(targetQueue, 'storageLocation.create', createStorageLocationDto);
    } catch (error) {
      this.logger.error(`Error creating storage location: ${error.message}`, error.stack);
      throw new HttpException(error.response || {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Get all storage locations
   * @param {Request} request - Express request object containing headers
   * @returns {Promise<StorageLocationResponseDto[]>} List of all storage locations
   */
  async getAllStorageLocations(request: Request): Promise<StorageLocationResponseDto[]> {
    try {
      this.logger.log('Getting all storage locations');
      const targetQueue = (request as any).targetQueue;
      this.logger.log(`Using queue: ${targetQueue} for storageLocation.findAll`);
      
      return await this.rabbitMQService.sendMessage(targetQueue, 'storageLocation.findAll', {});
    } catch (error) {
      this.logger.error(`Error getting all storage locations: ${error.message}`, error.stack);
      throw new HttpException(error.response || {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Get storage location by ID
   * @param {string} id - Storage location ID
   * @param {Request} request - Express request object containing headers
   * @returns {Promise<StorageLocationResponseDto>} The storage location
   */
  async getStorageLocationById(id: string, request: Request): Promise<StorageLocationResponseDto> {
    try {
      this.logger.log(`Getting storage location with ID: ${id}`);
      const targetQueue = (request as any).targetQueue;
      this.logger.log(`Using queue: ${targetQueue} for storageLocation.findOne`);
      
      return await this.rabbitMQService.sendMessage(targetQueue, 'storageLocation.findOne', id);
    } catch (error) {
      this.logger.error(`Error getting storage location by ID: ${error.message}`, error.stack);
      throw new HttpException(error.response || {
        statusCode: HttpStatus.NOT_FOUND,
        error: 'Not Found',
        message: `Storage location with ID ${id} not found`
      }, error.status || HttpStatus.NOT_FOUND);
    }
  }

  /**
   * Update storage location
   * @param {string} id - Storage location ID
   * @param {UpdateStorageLocationDto} updateStorageLocationDto - Updated data
   * @param {Request} request - Express request object containing headers
   * @returns {Promise<StorageLocationResponseDto>} Updated storage location
   */
  async updateStorageLocation(id: string, updateStorageLocationDto: UpdateDentalStorageLocationDto, request: Request): Promise<StorageLocationResponseDto> {
    try {
      this.logger.log(`Updating storage location with ID: ${id}`);
      const targetQueue = (request as any).targetQueue;
      this.logger.log(`Using queue: ${targetQueue} for storageLocation.update`);
      
      return await this.rabbitMQService.sendMessage(targetQueue, 'storageLocation.update', { id, updateDto: updateStorageLocationDto });
    } catch (error) {
      this.logger.error(`Error updating storage location: ${error.message}`, error.stack);
      throw new HttpException(error.response || {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Delete storage location
   * @param {string} id - Storage location ID
   * @param {Request} request - Express request object containing headers
   * @returns {Promise<void>}
   */
  async deleteStorageLocation(id: string, request: Request): Promise<void> {
    try {
      this.logger.log(`Deleting storage location with ID: ${id}`);
      const targetQueue = (request as any).targetQueue;
      this.logger.log(`Using queue: ${targetQueue} for storageLocation.delete`);
      
      return await this.rabbitMQService.sendMessage(targetQueue, 'storageLocation.delete', id);
    } catch (error) {
      this.logger.error(`Error deleting storage location: ${error.message}`, error.stack);
      throw new HttpException(error.response || {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Merge storage locations
   * @param {string} sourceId - Source storage location ID
   * @param {string} targetId - Target storage location ID
   * @param {Request} request - Express request object containing headers
   * @returns {Promise<any>} Merge confirmation
   */
  async mergeStorageLocations(sourceId: string, targetId: string, request: Request): Promise<any> {
    try {
      this.logger.log(`Merging storage location ${sourceId} into ${targetId}`);
      const targetQueue = (request as any).targetQueue;
      this.logger.log(`Using queue: ${targetQueue} for storageLocation.merge`);
      
      return await this.rabbitMQService.sendMessage(targetQueue, 'storageLocation.merge', { sourceId, targetId });
    } catch (error) {
      this.logger.error(`Error merging storage locations: ${error.message}`, error.stack);
      throw new HttpException(error.response || {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
