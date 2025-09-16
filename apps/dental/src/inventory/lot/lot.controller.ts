import { Controller, HttpStatus, NotFoundException } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { LotService } from './lot.service';
import { CreateDentalLotDto } from '@app/shared';
import { UpdateLotRequestDto } from '@app/shared';
import { FileLoggerService } from '@app/shared';

@Controller()
export class LotController {
  private readonly logFileName = 'inventory';
  /**
   * Safely extracts error message from unknown error type
   */
  private getErrorMessage(error: unknown): string {
    return error instanceof Error ? error.message : 'Unknown error';
  }

  constructor(
    private readonly lotService: LotService,
    private readonly logger: FileLoggerService,
  ) {
    this.logger.setContext('LotController');
    this.logger.setLogFileName(this.logFileName);
  }
  @MessagePattern('lot.create')
  async createLot(@Payload() createLotDto: CreateDentalLotDto) {
    this.logger.log(
      `Creating new lot: ${JSON.stringify({
        ...createLotDto,
        newSupplier: createLotDto.newSupplier
          ? '(new supplier data provided)'
          : undefined,
      })}`,
    );

    try {
      return await this.lotService.create(createLotDto);
    } catch (error) {
      this.logger.error(`Error creating lot: ${this.getErrorMessage(error)}`);
      throw new RpcException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Internal Server Error',
        message: this.getErrorMessage(error) || 'Error creating lot',
      });
    }
  }
  @MessagePattern('lot.findAll')
  async findAllLots() {
    this.logger.log('Finding all lots');
    try {
      return await this.lotService.findAll();
    } catch (error) {
      this.logger.error(`Error fetching lots: ${this.getErrorMessage(error)}`);
      throw new RpcException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Internal Server Error',
        message: this.getErrorMessage(error) || 'Error fetching lots',
      });
    }
  }
  @MessagePattern('lot.findOne')
  async findOneLot(@Payload() id: string) {
    this.logger.log(`Finding lot with ID: ${id}`);
    try {
      return await this.lotService.findOne(id);
    } catch (error) {
      this.logger.error(
        `Error fetching lot with ID ${id}: ${this.getErrorMessage(error)}`,
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
          this.getErrorMessage(error) || `Error fetching lot with ID ${id}`,
      });
    }
  } /**
   * Find lots by inventory item ID
   *
   * @param inventoryItemId - The ID of the inventory item
   * @returns Lots associated with the inventory item
   */
  @MessagePattern('lot.findByInventoryItem')
  async findLotsByInventoryItem(@Payload() inventoryItemId: string) {
    this.logger.log(`Finding lots for inventory item: ${inventoryItemId}`);
    try {
      return await this.lotService.findByInventoryItem(inventoryItemId);
    } catch (error) {
      this.logger.error(
        `Error fetching lots for inventory item ${inventoryItemId}: ${this.getErrorMessage(
          error,
        )}`,
      );
      throw new RpcException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Internal Server Error',
        message:
          this.getErrorMessage(error) ||
          `Error fetching lots for inventory item ${inventoryItemId}`,
      });
    }
  }
  /**
   * Find lots by storage location ID
   *
   * @param storageLocationId - The ID of the storage location
   * @returns Lots stored in the specified location
   */
  @MessagePattern('lot.findByStorageLocation')
  async findLotsByStorageLocation(@Payload() storageLocationId: string) {
    this.logger.log(`Finding lots for storage location: ${storageLocationId}`);
    try {
      return await this.lotService.findByStorageLocation(storageLocationId);
    } catch (error) {
      this.logger.error(
        `Error fetching lots for storage location ${storageLocationId}: ${this.getErrorMessage(
          error,
        )}`,
      );
      throw new RpcException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Internal Server Error',
        message:
          this.getErrorMessage(error) ||
          `Error fetching lots for storage location ${storageLocationId}`,
      });
    }
  }
  /**
   * Find lots by supplier ID
   *
   * @param supplierId - The ID of the supplier
   * @returns Lots provided by the specified supplier
   */
  @MessagePattern('lot.findBySupplier')
  async findLotsBySupplier(@Payload() supplierId: string) {
    this.logger.log(`Finding lots for supplier: ${supplierId}`);
    try {
      return await this.lotService.findBySupplier(supplierId);
    } catch (error) {
      this.logger.error(
        `Error fetching lots for supplier ${supplierId}: ${this.getErrorMessage(
          error,
        )}`,
      );
      throw new RpcException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Internal Server Error',
        message:
          this.getErrorMessage(error) ||
          `Error fetching lots for supplier ${supplierId}`,
      });
    }
  }
  @MessagePattern('lot.update')
  async updateLot(
    @Payload() payload: { id: string; updateLotDto: UpdateLotRequestDto },
  ) {
    this.logger.log(
      `Updating lot with ID: ${payload.id}, data: ${JSON.stringify(payload.updateLotDto)}`,
    );
    try {
      return await this.lotService.update(payload.id, payload.updateLotDto);
    } catch (error) {
      this.logger.error(
        `Error updating lot with ID ${payload.id}: ${this.getErrorMessage(error)}`,
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
          `Error updating lot with ID ${payload.id}`,
      });
    }
  }
  @MessagePattern('lot.delete')
  async removeLot(@Payload() id: string) {
    this.logger.log(`Removing lot with ID: ${id}`);
    try {
      await this.lotService.remove(id);
      return {
        success: true,
        message: `Lot with ID ${id} deleted successfully`,
      };
    } catch (error) {
      this.logger.error(
        `Error removing lot with ID ${id}: ${this.getErrorMessage(error)}`,
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
          this.getErrorMessage(error) || `Error removing lot with ID ${id}`,      });
    }
  }
}
