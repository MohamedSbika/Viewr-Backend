import { Injectable, Logger, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { CreateBiologyInventoryItemDto } from '@app/shared';
import { UpdateInventoryItemDto } from '@app/shared';
import { InventoryItemBiologyResponseDto } from '@app/shared';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class InventoryItemService {
  private readonly logger = new Logger(InventoryItemService.name);

  constructor(
    @Inject('BIOLOGY_SERVICE') private readonly bioClient: ClientProxy
  ) {
    this.logger.log('inventoryItem Service initialized');
  }

  async create(createItem: CreateBiologyInventoryItemDto): Promise<InventoryItemBiologyResponseDto> {
    this.logger.log(`Sending request to create inventory: ${JSON.stringify(createItem)}`);
    try {
      const newItem = await firstValueFrom(
        this.bioClient.send<InventoryItemBiologyResponseDto, CreateBiologyInventoryItemDto>('inventoryItem.create', createItem)
      );
      this.logger.log(`Received response for inventory creation: ${JSON.stringify(newItem)}`);
      return newItem;
    } catch (error) {
      this.logger.error(`Error during inventory creation RPC call: ${error.message}`, error.stack);

      throw new HttpException(error.response || {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);

    }
  }

  async findAll(): Promise<InventoryItemBiologyResponseDto[]> {
    this.logger.log(`Sending request to fetch all inventoryItem`);
    try {
      const item = await firstValueFrom(
        this.bioClient.send<InventoryItemBiologyResponseDto[], {}>('inventoryItem.findAll', {})
      );
      this.logger.log(`Received response for fetching all inventoryItem: ${item.length} found`);
      return item;
    } catch (error) {
      this.logger.error(`Error during fetch all inventoryItem RPC call: ${error.message}`, error.stack);

      throw new HttpException(error.response || {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);

    }
  }
  async findById(id: string): Promise<InventoryItemBiologyResponseDto> {

    try {
      const item = await firstValueFrom(
        this.bioClient.send<InventoryItemBiologyResponseDto>('inventoryItem.findOne', { id })
      );
      return item;

    } catch (error) {
      this.logger.error(`Error during fetch inventoyItem RPC call: ${error.message}`, error.stack);
      throw new HttpException(error.response || {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);

    }
  }
async updateItem(id: string , data : UpdateInventoryItemDto): Promise<InventoryItemBiologyResponseDto> {
  console.log(data)
        try {
            const Item = await firstValueFrom(
                this.bioClient.send<InventoryItemBiologyResponseDto>('inventoryItem.update', { id,updateItem:data })
            );
            return Item;

        } catch (error) {
            this.logger.error(`Error during task inventoryItem RPC call: ${error.message}`, error.stack);
            throw new HttpException(error.response || {
              statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
              error: error.error,
              message: error.message
            }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
      
        }
    }
 async deleteItem(id: string): Promise<InventoryItemBiologyResponseDto> {

        try {
            const item = await firstValueFrom(
                this.bioClient.send<InventoryItemBiologyResponseDto>('inventoryItem.remove', { id })
            );
            return item;

        } catch (error) {
            this.logger.error(`Error during deleting inventoryItem RPC call: ${error.message}`, error.stack);
            throw new HttpException(error.response || {
              statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
              error: error.error,
              message: error.message
            }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
      
        }
    }

}