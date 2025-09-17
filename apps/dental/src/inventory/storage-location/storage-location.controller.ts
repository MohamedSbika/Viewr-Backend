import { Controller, HttpStatus, NotFoundException } from '@nestjs/common';
import { StorageLocationService } from './storage-location.service';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { CreateStorageLocationDto } from './dto/create-storage-location.dto';
import { UpdateStorageLocationDto } from './dto/update-storage-location.dto';
import { FileLoggerService, FileLoggerService1 } from '@app/shared';

@Controller()
export class StorageLocationController {
  private readonly logFileName = 'storage-location';

  /**
   * Safely extracts error message from unknown error type
   */
  private getErrorMessage(error: unknown): string {
    return error instanceof Error ? error.message : 'Unknown error';
  }

  constructor(
    private readonly storageLocationService: StorageLocationService,
    private readonly logger: FileLoggerService1,
  ) {}
  // Using the agreed format: submodule.action
  @MessagePattern('storageLocation.findAll')
  async getAllStorageLocations() {
    this.logger.log(
      'Getting all storage locations',
      this.logFileName,
      'getAllStorageLocations',
    );
    try {
      return await this.storageLocationService.findAll();
    } catch (error) {
      this.logger.error(
        `Error fetching storage locations: ${this.getErrorMessage(error)}`,
        this.logFileName,
        'getAllStorageLocations',
      );
      throw new RpcException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Internal Server Error',
        message:
          this.getErrorMessage(error) || 'Error fetching storage locations',
      });
    }
  }

  @MessagePattern('storageLocation.findOne')
  async getStorageLocation(@Payload() id: string) {
    this.logger.log(
      `Getting storage location with ID: ${id}`,
      this.logFileName,
      'getStorageLocation',
    );
    try {
      return await this.storageLocationService.findOne(id);
    } catch (error) {
      this.logger.error(
        `Error fetching storage location with ID ${id}: ${this.getErrorMessage(error)}`,
        this.logFileName,
        'getStorageLocation',
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
        message:
          this.getErrorMessage(error) ||
          `Error fetching storage location with ID ${id}`,
      });
    }
  }

  @MessagePattern('storageLocation.create')
  async createStorageLocation(@Payload() createDto: CreateStorageLocationDto) {
    this.logger.log(
      `Creating new storage location: ${JSON.stringify(createDto)}`,
      this.logFileName,
      'createStorageLocation',
    );
    try {
      return await this.storageLocationService.create(createDto);
    } catch (error) {
      this.logger.error(
        `Error creating storage location: ${this.getErrorMessage(error)}`,
        this.logFileName,
        'createStorageLocation',
      );
      throw new RpcException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Internal Server Error',
        message:
          this.getErrorMessage(error) || 'Error creating storage location',
      });
    }
  }

  @MessagePattern('storageLocation.update')
  async updateStorageLocation(
    @Payload() data: { id: string; updateDto: UpdateStorageLocationDto },
  ) {
    this.logger.log(
      `Updating storage location with ID: ${data.id}, data: ${JSON.stringify(data.updateDto)}`,
      this.logFileName,
      'updateStorageLocation',
    );
    try {
      return await this.storageLocationService.update(data.id, data.updateDto);
    } catch (error) {
      this.logger.error(
        `Error updating storage location with ID ${data.id}: ${this.getErrorMessage(error)}`,
        this.logFileName,
        'updateStorageLocation',
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
        message:
          this.getErrorMessage(error) ||
          `Error updating storage location with ID ${data.id}`,
      });
    }
  }

  @MessagePattern('storageLocation.delete')
  async deleteStorageLocation(@Payload() id: string) {
    this.logger.log(
      `Deleting storage location with ID: ${id}`,
      this.logFileName,
      'deleteStorageLocation',
    );
    try {
      await this.storageLocationService.remove(id);
      return {
        success: true,
        message: `Storage location with ID ${id} deleted successfully`,
      };
    } catch (error) {
      this.logger.error(
        `Error removing storage location with ID ${id}: ${this.getErrorMessage(error)}`,
        this.logFileName,
        'deleteStorageLocation',
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
        message:
          this.getErrorMessage(error) ||
          `Error removing storage location with ID ${id}`,
      });
    }
  }

  @MessagePattern('storageLocation.merge')
  async mergeStorageLocations(
    @Payload() data: { sourceId: string; targetId: string },
  ) {
    this.logger.log(
      `Merging storage locations: source=${data.sourceId}, target=${data.targetId}`,
      this.logFileName,
      'mergeStorageLocations',
    );
    try {
      await this.storageLocationService.mergeLocations(
        data.sourceId,
        data.targetId,
      );
      return {
        success: true,
        message: `Storage location ${data.sourceId} successfully merged into ${data.targetId}`,
      };
    } catch (error) {
      this.logger.error(
        `Error merging storage locations: ${this.getErrorMessage(error)}`,
        this.logFileName,
        'mergeStorageLocations',
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
        message:
          this.getErrorMessage(error) || 'Error merging storage locations',      });
    }
  }
}
