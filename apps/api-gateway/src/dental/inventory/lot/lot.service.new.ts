import { Injectable, Logger, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { Request } from 'express';
import { CreateDentalLotDto } from '@app/shared';
import { UpdateLotRequestDto } from '@app/shared';
import { LotResponseDentalDto } from '@app/shared';
import { RabbitMQService } from '@app/shared';

@Injectable()
export class LotService {
  private readonly logger = new Logger(LotService.name);

  constructor(
    @Inject('DENTIST_SERVICE') private readonly dentistClient: ClientProxy,
    private readonly rabbitMQService: RabbitMQService
  ) {
    this.logger.log('Lot Service initialized');
  }

  /**
   * Create a new lot
   * @param {CreateLotDto} createLotDto - Lot data
   * @param {Request} request - Express request object containing headers
   * @returns {Promise<LotResponseDto>} The created lot
   */
  async createLot(createLotDto: CreateDentalLotDto, request: Request): Promise<LotResponseDentalDto> {
    try {
      this.logger.log(`Creating lot for inventory item: ${createLotDto.inventoryItemId}`);
      
      const targetQueue = (request as any).targetQueue;
      this.logger.log(`Using queue: ${targetQueue} for lot.create`);
      
      return await this.rabbitMQService.sendMessage(targetQueue, 'lot.create', createLotDto);
    } catch (error) {
      const errorMessage = error?.message || error?.toString() || 'Unknown error occurred';
      this.logger.error(`Error creating lot: ${errorMessage}`, error.stack || error);
      
      throw new HttpException(
        {
          statusCode: error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Lot Creation Failed',
          message: `Failed to create lot: ${errorMessage}`,
          originalError: error?.response || error
        },
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Get all lots
   * @param {Request} request - Express request object containing headers
   * @returns {Promise<LotResponseDto[]>} List of all lots
   */
  async getAllLots(request: Request): Promise<LotResponseDentalDto[]> {
    try {
      this.logger.log('Getting all lots');
      
      const targetQueue = (request as any).targetQueue;
      this.logger.log(`Using queue: ${targetQueue} for lot.findAll`);
      
      return await this.rabbitMQService.sendMessage(targetQueue, 'lot.findAll', {});
    } catch (error) {
      const errorMessage = error?.message || error?.toString() || 'Unknown error occurred';
      this.logger.error(`Error getting all lots: ${errorMessage}`, error.stack || error);
      
      throw new HttpException(
        {
          statusCode: error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Lots Retrieval Failed',
          message: `Failed to retrieve lots: ${errorMessage}`,
          originalError: error?.response || error
        },
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Get lot by ID
   * @param {string} id - Lot ID
   * @param {Request} request - Express request object containing headers
   * @returns {Promise<LotResponseDto>} The lot
   */
  async getLotById(id: string, request: Request): Promise<LotResponseDentalDto> {
    try {
      this.logger.log(`Getting lot with ID: ${id}`);
      
      const targetQueue = (request as any).targetQueue;
      this.logger.log(`Using queue: ${targetQueue} for lot.findOne`);
      
      return await this.rabbitMQService.sendMessage(targetQueue, 'lot.findOne', { id });
    } catch (error) {
      const errorMessage = error?.message || error?.toString() || 'Unknown error occurred';
      this.logger.error(`Error getting lot by ID: ${errorMessage}`, error.stack || error);
      
      throw new HttpException(
        {
          statusCode: error?.status || HttpStatus.NOT_FOUND,
          error: 'Lot Not Found',
          message: `Lot with ID ${id} not found: ${errorMessage}`,
          originalError: error?.response || error
        },
        error?.status || HttpStatus.NOT_FOUND
      );
    }
  }

  /**
   * Update lot
   * @param {string} id - Lot ID
   * @param {UpdateLotDto} updateLotDto - Updated data
   * @param {Request} request - Express request object containing headers
   * @returns {Promise<LotResponseDto>} Updated lot
   */
  async updateLot(id: string, updateLotDto: UpdateLotRequestDto, request: Request): Promise<LotResponseDentalDto> {
    try {
      this.logger.log(`Updating lot with ID: ${id}`);
      
      const targetQueue = (request as any).targetQueue;
      this.logger.log(`Using queue: ${targetQueue} for lot.update`);
      
      return await this.rabbitMQService.sendMessage(targetQueue, 'lot.update', { id, updateLotDto });
    } catch (error) {
      const errorMessage = error?.message || error?.toString() || 'Unknown error occurred';
      this.logger.error(`Error updating lot: ${errorMessage}`, error.stack || error);
      
      throw new HttpException(
        {
          statusCode: error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Lot Update Failed',
          message: `Failed to update lot: ${errorMessage}`,
          originalError: error?.response || error
        },
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Delete lot
   * @param {string} id - Lot ID
   * @param {Request} request - Express request object containing headers
   * @returns {Promise<void>}
   */
  async deleteLot(id: string, request: Request): Promise<void> {
    try {
      this.logger.log(`Deleting lot with ID: ${id}`);
      
      const targetQueue = (request as any).targetQueue;
      this.logger.log(`Using queue: ${targetQueue} for lot.remove`);
      
      return await this.rabbitMQService.sendMessage(targetQueue, 'lot.remove', { id });
    } catch (error) {
      const errorMessage = error?.message || error?.toString() || 'Unknown error occurred';
      this.logger.error(`Error deleting lot: ${errorMessage}`, error.stack || error);
      
      throw new HttpException(
        {
          statusCode: error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Lot Deletion Failed',
          message: `Failed to delete lot: ${errorMessage}`,
          originalError: error?.response || error
        },
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Get lots by inventory item ID
   * @param {string} inventoryItemId - Inventory item ID
   * @param {Request} request - Express request object containing headers
   * @returns {Promise<LotResponseDto[]>} Lots for the specified inventory item
   */
  async getLotsByInventoryItemId(inventoryItemId: string, request: Request): Promise<LotResponseDentalDto[]> {
    try {
      this.logger.log(`Getting lots for inventory item: ${inventoryItemId}`);
      
      const targetQueue = (request as any).targetQueue;
      this.logger.log(`Using queue: ${targetQueue} for lot.findByInventoryItem`);
      
      return await this.rabbitMQService.sendMessage(targetQueue, 'lot.findByInventoryItem', { inventoryItemId });
    } catch (error) {
      const errorMessage = error?.message || error?.toString() || 'Unknown error occurred';
      this.logger.error(`Error getting lots by inventory item: ${errorMessage}`, error.stack || error);
      
      throw new HttpException(
        {
          statusCode: error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Lots by Inventory Item Retrieval Failed',
          message: `Failed to retrieve lots by inventory item: ${errorMessage}`,
          originalError: error?.response || error
        },
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Get lots by status
   * @param {string} status - Lot status
   * @param {Request} request - Express request object containing headers
   * @returns {Promise<LotResponseDto[]>} Lots with the specified status
   */
  async getLotsByStatus(status: string, request: Request): Promise<LotResponseDentalDto[]> {
    try {
      this.logger.log(`Getting lots by status: ${status}`);
      
      const targetQueue = (request as any).targetQueue;
      this.logger.log(`Using queue: ${targetQueue} for lot.findByStatus`);
      
      return await this.rabbitMQService.sendMessage(targetQueue, 'lot.findByStatus', { status });
    } catch (error) {
      const errorMessage = error?.message || error?.toString() || 'Unknown error occurred';
      this.logger.error(`Error getting lots by status: ${errorMessage}`, error.stack || error);
      
      throw new HttpException(
        {
          statusCode: error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Lots by Status Retrieval Failed',
          message: `Failed to retrieve lots by status: ${errorMessage}`,
          originalError: error?.response || error
        },
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
