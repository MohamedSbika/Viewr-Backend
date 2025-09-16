import { Controller, Get, Post, Body, Param, Put, Delete, Logger, Inject, Req } from '@nestjs/common';
import type { Request } from 'express';
import { LotService } from './lot.service';
import { CreateDentalLotDto } from '@app/shared';
import { UpdateLotRequestDto } from '@app/shared';
import { LotResponseDentalDto } from '@app/shared';
import { FileLoggerService } from '@app/shared';

@Controller('dentist/inventory/lots')
export class LotController {
  private readonly logger = new Logger(LotController.name);

  constructor(
    private readonly lotService: LotService,
    @Inject('FileLogger') private readonly fileLogger: FileLoggerService
  ) {
    this.logger.log('Lot controller initialized');
  }

  /**
   * Creates a new lot
   * @param {CreateDentalLotDto} createLotDto - The lot data
   * @returns {Promise<LotResponseDentalDto>} Created lot information
   */
  @Post()
  async createLot(@Body() createLotDto: CreateDentalLotDto, @Req() request: Request): Promise<LotResponseDentalDto> {
    const logMessage = `Creating lot for inventory item: ${createLotDto.inventoryItemId}`;
    this.fileLogger.log(logMessage, 'lot-create', LotController.name);
    return this.lotService.createLot(createLotDto, request);
  }

  /**
   * Gets all lots
   * @returns {Promise<LotResponseDentalDto[]>} List of all lots
   */
  @Get()
  async getAllLots(@Req() request: Request): Promise<LotResponseDentalDto[]> {
    const logMessage = 'Getting all lots';
    this.fileLogger.log(logMessage, 'lot-findAll', LotController.name);
    return this.lotService.getAllLots(request);
  }

  /**
   * Gets a specific lot by ID
   * @param {string} id - Lot ID
   * @returns {Promise<LotResponseDentalDto>} The lot details
   */
  @Get(':id')
  async getLotById(@Param('id') id: string, @Req() request: Request): Promise<LotResponseDentalDto> {
    const logMessage = `Getting lot with ID: ${id}`;
    this.fileLogger.log(logMessage, 'lot-findOne', LotController.name);
    return this.lotService.getLotById(id, request);
  }

  /**
   * Updates a lot
   * @param {string} id - Lot ID
   * @param {UpdateLotDto} updateLotDto - Updated data
   * @returns {Promise<LotResponseDentalDto>} Updated lot
   */
  @Put(':id')
  async updateLot(
    @Param('id') id: string,
    @Body() updateLotDto: UpdateLotRequestDto,
    @Req() request: Request
  ): Promise<LotResponseDentalDto> {
    const logMessage = `Updating lot with ID: ${id}`;
    this.fileLogger.log(logMessage, 'lot-update', LotController.name);
    return this.lotService.updateLot(id, updateLotDto, request);
  }

  /**
   * Deletes a lot
   * @param {string} id - Lot ID
   * @returns {Promise<void>}
   */
  @Delete(':id')
  async deleteLot(@Param('id') id: string, @Req() request: Request): Promise<void> {
    const logMessage = `Deleting lot with ID: ${id}`;
    this.fileLogger.log(logMessage, 'lot-delete', LotController.name);
    return this.lotService.deleteLot(id, request);
  }

  /**
   * Gets lots by inventory item
   * @param {string} inventoryItemId - Inventory item ID
   * @returns {Promise<LotResponseDentalDto[]>} Lots for the specified inventory item
   */
  @Get('inventory-item/:inventoryItemId')
  async getLotsByInventoryItem(@Param('inventoryItemId') inventoryItemId: string, @Req() request: Request): Promise<LotResponseDentalDto[]> {
    const logMessage = `Getting lots for inventory item: ${inventoryItemId}`;
    this.fileLogger.log(logMessage, 'lot-findByInventoryItem', LotController.name);
    return this.lotService.getLotsByInventoryItemId(inventoryItemId, request);
  }

  /**
   * Gets lots by status
   * @param {string} status - Lot status
   * @returns {Promise<LotResponseDentalDto[]>} Lots with the specified status
   */
  @Get('status/:status')
  async getLotsByStatus(@Param('status') status: string, @Req() request: Request): Promise<LotResponseDentalDto[]> {
    const logMessage = `Getting lots by status: ${status}`;
    this.fileLogger.log(logMessage, 'lot-findByStatus', LotController.name);
    return this.lotService.getLotsByStatus(status, request);
  }
}
