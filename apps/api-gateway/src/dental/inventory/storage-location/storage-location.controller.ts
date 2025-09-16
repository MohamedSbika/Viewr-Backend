import { Controller, Get, Post, Body, Param, Put, Delete, Logger, Inject, Req } from '@nestjs/common';
import type { Request } from 'express';
import { StorageLocationService } from './storage-location.service';
import { CreateDentalStorageLocationDto } from '@app/shared';
import { UpdateDentalStorageLocationDto } from '@app/shared';
import { StorageLocationResponseDto } from '@app/shared';
import { FileLoggerService } from '@app/shared';

@Controller('dentist/inventory/storage-locations')
export class StorageLocationController {
  private readonly logger = new Logger(StorageLocationController.name);

  constructor(
    private readonly storageLocationService: StorageLocationService,
    @Inject('FileLogger') private readonly fileLogger: FileLoggerService
  ) {
    this.logger.log('Storage Location controller initialized');
  }

  /**
   * Creates a new storage location
   * @param {CreateDentalStorageLocationDto} createStorageLocationDto - The storage location data
   * @returns {Promise<StorageLocationResponseDto>} Created storage location information
   */
  @Post()
  async createStorageLocation(@Body() createStorageLocationDto: CreateDentalStorageLocationDto, @Req() request: Request): Promise<StorageLocationResponseDto> {
    const logMessage = `Creating storage location: ${createStorageLocationDto.locationName}`;
    this.fileLogger.log(logMessage, 'storageLocation-create', StorageLocationController.name);
    return this.storageLocationService.createStorageLocation(createStorageLocationDto, request);
  }

  /**
   * Gets all storage locations
   * @returns {Promise<StorageLocationResponseDto[]>} List of all storage locations
   */
  @Get()
  async getAllStorageLocations(@Req() request: Request): Promise<StorageLocationResponseDto[]> {
    const logMessage = 'Getting all storage locations';
    this.fileLogger.log(logMessage, 'storageLocation-findAll', StorageLocationController.name);
    return this.storageLocationService.getAllStorageLocations(request);
  }

  /**
   * Gets a specific storage location by ID
   * @param {string} id - Storage location ID
   * @returns {Promise<StorageLocationResponseDto>} The storage location details
   */
  @Get(':id')
  async getStorageLocationById(@Param('id') id: string, @Req() request: Request): Promise<StorageLocationResponseDto> {
    const logMessage = `Getting storage location with ID: ${id}`;
    this.fileLogger.log(logMessage, 'storageLocation-findOne', StorageLocationController.name);
    return this.storageLocationService.getStorageLocationById(id, request);
  }

  /**
   * Updates a storage location
   * @param {string} id - Storage location ID
   * @param {UpdateStorageLocationDto} updateStorageLocationDto - Updated data
   * @returns {Promise<StorageLocationResponseDto>} Updated storage location
   */
  @Put(':id')
  async updateStorageLocation(
    @Param('id') id: string,
    @Body() updateStorageLocationDto: UpdateDentalStorageLocationDto,
    @Req() request: Request
  ): Promise<StorageLocationResponseDto> {
    const logMessage = `Updating storage location with ID: ${id}`;
    this.fileLogger.log(logMessage, 'storageLocation-update', StorageLocationController.name);
    return this.storageLocationService.updateStorageLocation(id, updateStorageLocationDto, request);
  }

  /**
   * Deletes a storage location
   * @param {string} id - Storage location ID
   * @returns {Promise<void>}
   */
  @Delete(':id')
  async deleteStorageLocation(@Param('id') id: string, @Req() request: Request): Promise<void> {
    const logMessage = `Deleting storage location with ID: ${id}`;
    this.fileLogger.log(logMessage, 'storageLocation-delete', StorageLocationController.name);
    return this.storageLocationService.deleteStorageLocation(id, request);
  }

  /**
   * Merges two storage locations
   * @param {string} sourceId - Source storage location ID
   * @param {string} targetId - Target storage location ID
   * @returns {Promise<any>} Merge confirmation
   */
  @Post('merge')
  async mergeStorageLocations(@Body() data: { sourceId: string; targetId: string }, @Req() request: Request): Promise<any> {
    const logMessage = `Merging storage location ${data.sourceId} into ${data.targetId}`;
    this.fileLogger.log(logMessage, 'storageLocation-merge', StorageLocationController.name);
    return this.storageLocationService.mergeStorageLocations(data.sourceId, data.targetId, request);
  }
}
