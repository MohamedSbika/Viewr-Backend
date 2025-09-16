import { Controller, Get, Post, Body, Param, Put, Delete, Logger, Inject, Query, Req } from '@nestjs/common';
import type { Request } from 'express';
import { InventoryItemService } from './inventory-item.service';
import { CreateDentalInventoryItemDto } from '@app/shared';
import { UpdateInventoryItemDto } from '@app/shared';
import { InventoryItemDentalResponseDto } from '@app/shared';
import { FileLoggerService } from '@app/shared';
import { InventoryItem } from '@app/shared';
export interface InventoryItemWithStock extends InventoryItem {
  currentStock: number;
}
@Controller('dentist/inventory/items')
export class InventoryItemController {
  private readonly logger = new Logger(InventoryItemController.name);

  constructor(
    private readonly inventoryItemService: InventoryItemService,
    @Inject('FileLogger') private readonly fileLogger: FileLoggerService
  ) {
    this.logger.log('Inventory Item controller initialized');
  }

  /**
   * Creates a new inventory item
   * @param {CreateDentalInventoryItemDto} createInventoryItemDto - The inventory item data
   * @returns {Promise<InventoryItemDentalResponseDto>} Created inventory item information
   */
  @Post()
  async createInventoryItem(@Body() createInventoryItemDto: CreateDentalInventoryItemDto, @Req() request: Request): Promise<InventoryItemDentalResponseDto> {
    const logMessage = `Creating inventory item: ${createInventoryItemDto.name}`;
    this.fileLogger.log(logMessage, 'inventoryItem-create', InventoryItemController.name);
    return this.inventoryItemService.createInventoryItem(createInventoryItemDto, request);
  }

  /**
   * Gets all inventory items
   * @returns {Promise<InventoryItemDentalResponseDto[]>} List of all inventory items
   */
  @Get()
  async getAllInventoryItems(@Req() request: Request): Promise<InventoryItemWithStock[]> {
    const logMessage = 'Getting all inventory items';
    this.fileLogger.log(logMessage, 'inventoryItem-findAll', InventoryItemController.name);
    return this.inventoryItemService.getAllInventoryItems(request);
  }

  /**
   * Gets a specific inventory item by ID
   * @param {string} id - Inventory item ID
   * @returns {Promise<InventoryItemDentalResponseDto>} The inventory item details
   */
  @Get(':id')
  async getInventoryItemById(@Param('id') id: string, @Req() request: Request): Promise<InventoryItemDentalResponseDto> {
    const logMessage = `Getting inventory item with ID: ${id}`;
    this.fileLogger.log(logMessage, 'inventoryItem-findOne', InventoryItemController.name);
    return this.inventoryItemService.getInventoryItemById(id, request);
  }

  /**
   * Updates an inventory item
   * @param {string} id - Inventory item ID
   * @param {UpdateInventoryItemDto} updateInventoryItemDto - Updated data
   * @returns {Promise<InventoryItemDentalResponseDto>} Updated inventory item
   */
  @Put(':id')
  async updateInventoryItem(
    @Param('id') id: string,
    @Body() updateInventoryItemDto: UpdateInventoryItemDto,
    @Req() request: Request
  ): Promise<InventoryItemDentalResponseDto> {
    const logMessage = `Updating inventory item with ID: ${id}`;
    this.fileLogger.log(logMessage, 'inventoryItem-update', InventoryItemController.name);
    return this.inventoryItemService.updateInventoryItem(id, updateInventoryItemDto, request);
  }

  /**
   * Deletes an inventory item
   * @param {string} id - Inventory item ID
   * @returns {Promise<void>}
   */
  @Delete(':id')
  async deleteInventoryItem(@Param('id') id: string, @Req() request: Request): Promise<void> {
    const logMessage = `Deleting inventory item with ID: ${id}`;
    this.fileLogger.log(logMessage, 'inventoryItem-remove', InventoryItemController.name);
    return this.inventoryItemService.deleteInventoryItem(id, request);
  }

  /**
   * Gets inventory items by category
   * @param {string} category - Inventory item category
   * @returns {Promise<InventoryItemDentalResponseDto[]>} Items in the specified category
   */
  @Get('category/:category')
  async getInventoryItemsByCategory(@Param('category') category: string, @Req() request: Request): Promise<InventoryItemDentalResponseDto[]> {
    const logMessage = `Getting inventory items by category: ${category}`;
    this.fileLogger.log(logMessage, 'inventoryItem-findByCategory', InventoryItemController.name);
    return this.inventoryItemService.getInventoryItemsByCategory(category, request);
  }

  /**
   * Gets consumable inventory items
   * @returns {Promise<InventoryItemDentalResponseDto[]>} List of consumable items
   */
  @Get('types/consumables')
  async getConsumableItems(@Req() request: Request): Promise<InventoryItemDentalResponseDto[]> {
    const logMessage = 'Getting consumable inventory items';
    this.fileLogger.log(logMessage, 'inventoryItem-findConsumables', InventoryItemController.name);
    return this.inventoryItemService.getConsumableItems(request);
  }

  /**
   * Gets reusable inventory items
   * @returns {Promise<InventoryItemDentalResponseDto[]>} List of reusable items
   */
  @Get('types/reusables')
  async getReusableItems(@Req() request: Request): Promise<InventoryItemDentalResponseDto[]> {
    const logMessage = 'Getting reusable inventory items';
    this.fileLogger.log(logMessage, 'inventoryItem-findReusables', InventoryItemController.name);
    return this.inventoryItemService.getReusableItems(request);
  }

  /**
   * Search inventory items by name
   * @param {string} searchTerm - Search term
   * @returns {Promise<InventoryItemDentalResponseDto[]>} Matching inventory items
   */
  @Get('search')
  async searchInventoryItemsByName(@Query('term') searchTerm: string, @Req() request: Request): Promise<InventoryItemDentalResponseDto[]> {
    const logMessage = `Searching inventory items by name: ${searchTerm}`;
    this.fileLogger.log(logMessage, 'inventoryItem-searchByName', InventoryItemController.name);
    return this.inventoryItemService.searchInventoryItemsByName(searchTerm, request);
  }
}
