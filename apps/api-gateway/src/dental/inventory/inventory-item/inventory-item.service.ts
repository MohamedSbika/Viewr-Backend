import { Injectable, Logger, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Request } from 'express';
import { CreateDentalInventoryItemDto } from '@app/shared';
import { UpdateInventoryItemDto } from '@app/shared';
import { InventoryItemDentalResponseDto } from '@app/shared';
import { InventoryItem } from '@app/shared';
import { RabbitMQService } from '@app/shared';
export interface InventoryItemWithStock extends InventoryItem {
  currentStock: number;
}
@Injectable()
export class InventoryItemService {
  private readonly logger = new Logger(InventoryItemService.name);

  constructor(
    @Inject('DENTIST_SERVICE') private readonly dentistClient: ClientProxy,
    private readonly rabbitMQService: RabbitMQService
  ) {
    this.logger.log('Inventory Item Service initialized');
  }

  /**
   * Create a new inventory item
   * @param {CreateDentalInventoryItemDto} createInventoryItemDto - Inventory item data
   * @param {Request} request - Express request object containing headers
   * @returns {Promise<InventoryItemDentalResponseDto>} The created inventory item
   */
  async createInventoryItem(createInventoryItemDto: CreateDentalInventoryItemDto, request: Request): Promise<InventoryItemDentalResponseDto> {
    try {
      this.logger.log(`Creating inventory item: ${createInventoryItemDto.name}`);
      
      const targetQueue = (request as any).targetQueue;
      this.logger.log(`Using queue: ${targetQueue} for inventoryItem.create`);
      
      return await this.rabbitMQService.sendMessage(targetQueue, 'inventoryItem.create', createInventoryItemDto);
    } catch (error) {
      const errorMessage = error?.message || error?.toString() || 'Unknown error occurred';
      this.logger.error(`Error creating inventory item: ${errorMessage}`, error.stack || error);
      
      throw new HttpException(
        {
          statusCode: error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Inventory Item Creation Failed',
          message: `Failed to create inventory item: ${errorMessage}`,
          originalError: error?.response || error
        },
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Get all inventory items
   * @param {Request} request - Express request object containing headers
   * @returns {Promise<InventoryItemWithStock[]>} List of all inventory items
   */
  async getAllInventoryItems(request: Request): Promise<InventoryItemWithStock[]> {
    try {
      this.logger.log('Getting all inventory items');
      const targetQueue = (request as any).targetQueue;
      this.logger.log(`Using queue: ${targetQueue} for inventory items retrieval`);
      
      return await this.rabbitMQService.sendMessage(
        targetQueue,
        'inventoryItem.findAll',
        {}
      );
    } catch (error) {
      const errorMessage = error?.message || error?.toString() || 'Unknown error occurred';
      this.logger.error(`Error getting all inventory items: ${errorMessage}`, error.stack || error);
      
      throw new HttpException(
        {
          statusCode: error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Inventory Items Retrieval Failed',
          message: `Failed to retrieve inventory items: ${errorMessage}`,
          originalError: error?.response || error
        },
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Get inventory item by ID
   * @param {string} id - Inventory item ID
   * @param {Request} request - Express request object containing headers
   * @returns {Promise<InventoryItemDentalResponseDto>} The inventory item
   */
  async getInventoryItemById(id: string, request: Request): Promise<InventoryItemDentalResponseDto> {
    try {
      this.logger.log(`Getting inventory item with ID: ${id}`);
      
      const targetQueue = (request as any).targetQueue;
      this.logger.log(`Using queue: ${targetQueue} for inventoryItem.findOne`);
      
      return await this.rabbitMQService.sendMessage(targetQueue, 'inventoryItem.findOne', { id });
    } catch (error) {
      const errorMessage = error?.message || error?.toString() || 'Unknown error occurred';
      this.logger.error(`Error getting inventory item by ID: ${errorMessage}`, error.stack || error);
      
      throw new HttpException(
        {
          statusCode: error?.status || HttpStatus.NOT_FOUND,
          error: 'Inventory Item Not Found',
          message: `Inventory item with ID ${id} not found: ${errorMessage}`,
          originalError: error?.response || error
        },
        error?.status || HttpStatus.NOT_FOUND
      );
    }
  }

  /**
   * Update inventory item
   * @param {string} id - Inventory item ID
   * @param {UpdateInventoryItemDto} updateInventoryItemDto - Updated data
   * @param {Request} request - Express request object containing headers
   * @returns {Promise<InventoryItemDentalResponseDto>} Updated inventory item
   */
  async updateInventoryItem(id: string, updateInventoryItemDto: UpdateInventoryItemDto, request: Request): Promise<InventoryItemDentalResponseDto> {
    try {
      this.logger.log(`Updating inventory item with ID: ${id}`);
      
      const targetQueue = (request as any).targetQueue;
      this.logger.log(`Using queue: ${targetQueue} for inventoryItem.update`);
      
      return await this.rabbitMQService.sendMessage(targetQueue, 'inventoryItem.update', { id, updateInventoryItemDto });
    } catch (error) {
      const errorMessage = error?.message || error?.toString() || 'Unknown error occurred';
      this.logger.error(`Error updating inventory item: ${errorMessage}`, error.stack || error);
      
      throw new HttpException(
        {
          statusCode: error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Inventory Item Update Failed',
          message: `Failed to update inventory item: ${errorMessage}`,
          originalError: error?.response || error
        },
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Delete inventory item
   * @param {string} id - Inventory item ID
   * @param {Request} request - Express request object containing headers
   * @returns {Promise<void>}
   */
  async deleteInventoryItem(id: string, request: Request): Promise<void> {
    try {
      this.logger.log(`Deleting inventory item with ID: ${id}`);
      
      const targetQueue = (request as any).targetQueue;
      
      if (!targetQueue) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            error: 'Bad Request',
            message: 'Missing x-target-queue header'
          },
          HttpStatus.BAD_REQUEST
        );
      }

      this.logger.log(`Using queue: ${targetQueue} for inventoryItem.remove`);
      
      return await this.rabbitMQService.sendMessage(targetQueue, 'inventoryItem.remove', { id });
    } catch (error) {
      const errorMessage = error?.message || error?.toString() || 'Unknown error occurred';
      this.logger.error(`Error deleting inventory item: ${errorMessage}`, error.stack || error);
      
      throw new HttpException(
        {
          statusCode: error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Inventory Item Deletion Failed',
          message: `Failed to delete inventory item: ${errorMessage}`,
          originalError: error?.response || error
        },
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Get inventory items by category
   * @param {string} category - Inventory item category
   * @param {Request} request - Express request object containing headers
   * @returns {Promise<InventoryItemDentalResponseDto[]>} Items in the specified category
   */
  async getInventoryItemsByCategory(category: string, request: Request): Promise<InventoryItemDentalResponseDto[]> {
    try {
      this.logger.log(`Getting inventory items by category: ${category}`);
      
      const targetQueue = (request as any).targetQueue;
      
      if (!targetQueue) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            error: 'Bad Request',
            message: 'Missing x-target-queue header'
          },
          HttpStatus.BAD_REQUEST
        );
      }

      this.logger.log(`Using queue: ${targetQueue} for inventoryItem.findByCategory`);
      
      return await this.rabbitMQService.sendMessage(targetQueue, 'inventoryItem.findByCategory', { category });
    } catch (error) {
      const errorMessage = error?.message || error?.toString() || 'Unknown error occurred';
      this.logger.error(`Error getting inventory items by category: ${errorMessage}`, error.stack || error);
      
      throw new HttpException(
        {
          statusCode: error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Inventory Items Retrieval by Category Failed',
          message: `Failed to retrieve inventory items by category: ${errorMessage}`,
          originalError: error?.response || error
        },
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Get consumable inventory items
   * @param {Request} request - Express request object containing headers
   * @returns {Promise<InventoryItemDentalResponseDto[]>} List of consumable items
   */
  async getConsumableItems(request: Request): Promise<InventoryItemDentalResponseDto[]> {
    try {
      this.logger.log('Getting consumable inventory items');
      
      const targetQueue = (request as any).targetQueue;
      
      if (!targetQueue) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            error: 'Bad Request',
            message: 'Missing x-target-queue header'
          },
          HttpStatus.BAD_REQUEST
        );
      }

      this.logger.log(`Using queue: ${targetQueue} for inventoryItem.findConsumables`);
      
      return await this.rabbitMQService.sendMessage(targetQueue, 'inventoryItem.findConsumables', {});
    } catch (error) {
      const errorMessage = error?.message || error?.toString() || 'Unknown error occurred';
      this.logger.error(`Error getting consumable items: ${errorMessage}`, error.stack || error);
      
      throw new HttpException(
        {
          statusCode: error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Consumable Items Retrieval Failed',
          message: `Failed to retrieve consumable items: ${errorMessage}`,
          originalError: error?.response || error
        },
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Get reusable inventory items
   * @param {Request} request - Express request object containing headers
   * @returns {Promise<InventoryItemDentalResponseDto[]>} List of reusable items
   */
  async getReusableItems(request: Request): Promise<InventoryItemDentalResponseDto[]> {
    try {
      this.logger.log('Getting reusable inventory items');
      
      const targetQueue = (request as any).targetQueue;
      
      if (!targetQueue) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            error: 'Bad Request',
            message: 'Missing x-target-queue header'
          },
          HttpStatus.BAD_REQUEST
        );
      }

      this.logger.log(`Using queue: ${targetQueue} for inventoryItem.findReusables`);
      
      return await this.rabbitMQService.sendMessage(targetQueue, 'inventoryItem.findReusables', {});
    } catch (error) {
      const errorMessage = error?.message || error?.toString() || 'Unknown error occurred';
      this.logger.error(`Error getting reusable items: ${errorMessage}`, error.stack || error);
      
      throw new HttpException(
        {
          statusCode: error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Reusable Items Retrieval Failed',
          message: `Failed to retrieve reusable items: ${errorMessage}`,
          originalError: error?.response || error
        },
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Search inventory items by name
   * @param {string} searchTerm - Search term
   * @param {Request} request - Express request object containing headers
   * @returns {Promise<InventoryItemDentalResponseDto[]>} Matching inventory items
   */
  async searchInventoryItemsByName(searchTerm: string, request: Request): Promise<InventoryItemDentalResponseDto[]> {
    try {
      this.logger.log(`Searching inventory items by name: ${searchTerm}`);
      
      const targetQueue = (request as any).targetQueue;
      
      if (!targetQueue) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            error: 'Bad Request',
            message: 'Missing x-target-queue header'
          },
          HttpStatus.BAD_REQUEST
        );
      }

      this.logger.log(`Using queue: ${targetQueue} for inventoryItem.searchByName`);
      
      return await this.rabbitMQService.sendMessage(targetQueue, 'inventoryItem.searchByName', { searchTerm });
    } catch (error) {
      const errorMessage = error?.message || error?.toString() || 'Unknown error occurred';
      this.logger.error(`Error searching inventory items by name: ${errorMessage}`, error.stack || error);
      
      throw new HttpException(
        {
          statusCode: error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Inventory Items Search Failed',
          message: `Failed to search inventory items by name: ${errorMessage}`,
          originalError: error?.response || error
        },
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
