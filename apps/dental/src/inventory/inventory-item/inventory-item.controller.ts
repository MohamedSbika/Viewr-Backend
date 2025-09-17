import { Controller, HttpStatus, NotFoundException } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { InventoryItemService } from './inventory-item.service';
import { CreateInventoryItemDto } from './dto/create-inventory-item.dto';
import { UpdateInventoryItemDto } from './dto/update-inventory-item.dto';
import { FileLoggerService, FileLoggerService1 } from '@app/shared';
import { InventoryItemCategory } from '@app/shared';
@Controller()
export class InventoryItemController {
  private readonly logFileName = 'inventory';

  /**
   * Safely extracts error message from unknown error type
   */
  private getErrorMessage(error: unknown): string {
    return error instanceof Error ? error.message : 'Unknown error';
  }

  /**
   * Safely extracts error stack from unknown error type
   */
  private getErrorStack(error: unknown): string | undefined {
    return error instanceof Error ? error.stack : undefined;
  }

  constructor(
    private readonly inventoryItemService: InventoryItemService,
    private readonly logger: FileLoggerService1,
  ) {
    this.logger.setContext('InventoryItemController');
    this.logger.setLogFileName(this.logFileName);
  }

  @MessagePattern('inventoryItem.create')
  async create(@Payload() createInventoryItemDto: CreateInventoryItemDto) {
    this.logger.log(
      `Creating new inventory item: ${JSON.stringify(createInventoryItemDto)}`,
      this.logFileName,
      'create',
    );

    try {
      return await this.inventoryItemService.create(createInventoryItemDto);
    } catch (error) {
      const errorMessage = this.getErrorMessage(error);
      const errorStack = this.getErrorStack(error);
      this.logger.error(
        `Error creating inventory item: ${errorMessage}`,
        errorStack,
      );
      throw new RpcException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Internal Server Error',
        message: errorMessage,
      });
    }
  }

  @MessagePattern('inventoryItem.findAll')
  async findAll() {
    this.logger.log(
      'Retrieving all inventory items',
      this.logFileName,
      'findAll',
    );

    try {
      return await this.inventoryItemService.findAll();
    } catch (error) {
      const errorMessage = this.getErrorMessage(error);
      const errorStack = this.getErrorStack(error);
      this.logger.error(
        `Error retrieving inventory items: ${errorMessage}`,
        errorStack,
      );
      throw new RpcException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Internal Server Error',
        message: errorMessage,
      });
    }
  }

  @MessagePattern('inventoryItem.findOne')
  async findOne(@Payload() data: { id: string }) {
    this.logger.log(
      `Retrieving inventory item with ID: ${data.id}`,
      this.logFileName,
      'findOne',
    );

    try {
      return await this.inventoryItemService.findOne(data.id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        const errorMessage = this.getErrorMessage(error);
        this.logger.warn(`Inventory item not found: ${errorMessage}`);
        throw new RpcException({
          statusCode: HttpStatus.NOT_FOUND,
          error: 'Not Found',
          message: errorMessage,
        });
      }

      const errorMessage = this.getErrorMessage(error);
      const errorStack = this.getErrorStack(error);
      this.logger.error(
        `Error retrieving inventory item: ${errorMessage}`,
        errorStack,
      );
      throw new RpcException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Internal Server Error',
        message: errorMessage,
      });
    }
  }

  @MessagePattern('inventoryItem.update')
  async update(
    @Payload()
    data: {
      id: string;
      updateInventoryItemDto: UpdateInventoryItemDto;
    },
  ) {
    this.logger.log(
      `Updating inventory item ${data.id}: ${JSON.stringify(data.updateInventoryItemDto)}`,
      this.logFileName,
      'update',
    );

    try {
      return await this.inventoryItemService.update(
        data.id,
        data.updateInventoryItemDto,
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        const errorMessage = this.getErrorMessage(error);
        this.logger.warn(
          `Inventory item not found for update: ${errorMessage}`,
        );
        throw new RpcException({
          statusCode: HttpStatus.NOT_FOUND,
          error: 'Not Found',
          message: errorMessage,
        });
      }

      const errorMessage = this.getErrorMessage(error);
      const errorStack = this.getErrorStack(error);
      this.logger.error(
        `Error updating inventory item: ${errorMessage}`,
        errorStack,
      );
      throw new RpcException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Internal Server Error',
        message: errorMessage,
      });
    }
  }

  @MessagePattern('inventoryItem.remove')
  async remove(@Payload() data: { id: string }) {
    this.logger.log(
      `Removing inventory item with ID: ${data.id}`,
      this.logFileName,
      'remove',
    );

    try {
      await this.inventoryItemService.remove(data.id);
      return { message: 'Inventory item deleted successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        const errorMessage = this.getErrorMessage(error);
        this.logger.warn(
          `Inventory item not found for deletion: ${errorMessage}`,
        );
        throw new RpcException({
          statusCode: HttpStatus.NOT_FOUND,
          error: 'Not Found',
          message: errorMessage,
        });
      }

      const errorMessage = this.getErrorMessage(error);
      const errorStack = this.getErrorStack(error);
      this.logger.error(
        `Error removing inventory item: ${errorMessage}`,
        errorStack,
      );
      throw new RpcException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Internal Server Error',
        message: errorMessage,
      });
    }
  }

  // @MessagePattern('inventoryItem.findByCategory')
  // async findByCategory(@Payload() data: { category: InventoryItemCategory }) {
  //   this.logger.log(
  //     `Retrieving inventory items by category: ${data.category}`,
  //     this.logFileName,
  //     'findByCategory',
  //   );

  //   try {
  //     return await this.inventoryItemService.findByCategory(data.category);
  //   } catch (error) {
  //     const errorMessage = this.getErrorMessage(error);
  //     const errorStack = this.getErrorStack(error);
  //     this.logger.error(
  //       `Error retrieving inventory items by category: ${errorMessage}`,
  //       errorStack,
  //     );
  //     throw new RpcException({
  //       statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
  //       error: 'Internal Server Error',
  //       message: errorMessage,
  //     });
  //   }
  // }

  @MessagePattern('inventoryItem.findConsumables')
  async findConsumables() {
    this.logger.log(
      'Retrieving consumable inventory items',
      this.logFileName,
      'findConsumables',
    );

    try {
      return await this.inventoryItemService.findConsumables();
    } catch (error) {
      const errorMessage = this.getErrorMessage(error);
      const errorStack = this.getErrorStack(error);
      this.logger.error(
        `Error retrieving consumable inventory items: ${errorMessage}`,
        errorStack,
      );
      throw new RpcException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Internal Server Error',
        message: errorMessage,
      });
    }
  }

  @MessagePattern('inventoryItem.findReusables')
  async findReusables() {
    this.logger.log(
      'Retrieving reusable inventory items',
      this.logFileName,
      'findReusables',
    );

    try {
      return await this.inventoryItemService.findReusables();
    } catch (error) {
      const errorMessage = this.getErrorMessage(error);
      const errorStack = this.getErrorStack(error);
      this.logger.error(
        `Error retrieving reusable inventory items: ${errorMessage}`,
        errorStack,
      );
      throw new RpcException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Internal Server Error',
        message: errorMessage,
      });
    }
  }

  @MessagePattern('inventoryItem.searchByName')
  async searchByName(@Payload() data: { searchTerm: string }) {
    this.logger.log(
      `Searching inventory items by name: ${data.searchTerm}`,
      this.logFileName,
      'searchByName',
    );

    try {
      return await this.inventoryItemService.searchByName(data.searchTerm);
    } catch (error) {
      const errorMessage = this.getErrorMessage(error);
      const errorStack = this.getErrorStack(error);
      this.logger.error(
        `Error searching inventory items by name: ${errorMessage}`,
        errorStack,
      );
      throw new RpcException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Internal Server Error',
        message: errorMessage,
      });
    }
  }
}