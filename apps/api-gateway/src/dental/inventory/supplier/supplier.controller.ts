import { Controller, Get, Post, Body, Param, Put, Delete, Logger, Inject, Req } from '@nestjs/common';
import type { Request } from 'express';
import { SupplierService } from './supplier.service';
import { CreateDentalSupplierDto } from '@app/shared';
import { UpdateSupplierDto } from '@app/shared';
import { SupplierResponseDto } from '@app/shared';
import { FileLoggerService } from '@app/shared';

@Controller('dentist/inventory/suppliers')
export class SupplierController {
  private readonly logger = new Logger(SupplierController.name);

  constructor(
    private readonly supplierService: SupplierService,
    @Inject('FileLogger') private readonly fileLogger: FileLoggerService
  ) {
    this.logger.log('Supplier controller initialized');
  }

  /**
   * Creates a new supplier
   * @param {CreateDentalSupplierDto} createSupplierDto - The supplier data
   * @param {Request} req - The Express request object
   * @returns {Promise<SupplierResponseDto>} Created supplier information
   */
  @Post()
  async createSupplier(@Body() createSupplierDto: CreateDentalSupplierDto, @Req() req: Request): Promise<SupplierResponseDto> {
    const logMessage = `Creating supplier: ${createSupplierDto.name}`;
    this.fileLogger.log(logMessage, 'supplier-create', SupplierController.name);
    return this.supplierService.createSupplier(createSupplierDto, req);
  }

  /**
   * Gets all suppliers
   * @param {Request} req - The Express request object
   * @returns {Promise<SupplierResponseDto[]>} List of all suppliers
   */
  @Get()
  async getAllSuppliers(@Req() req: Request): Promise<SupplierResponseDto[]> {
    const logMessage = 'Getting all suppliers';
    this.fileLogger.log(logMessage, 'supplier-findAll', SupplierController.name);
    return this.supplierService.getAllSuppliers(req);
  }

  /**
   * Gets a specific supplier by ID
   * @param {string} id - Supplier ID
   * @param {Request} req - The Express request object
   * @returns {Promise<SupplierResponseDto>} The supplier details
   */
  @Get(':id')
  async getSupplierById(@Param('id') id: string, @Req() req: Request): Promise<SupplierResponseDto> {
    const logMessage = `Getting supplier with ID: ${id}`;
    this.fileLogger.log(logMessage, 'supplier-findOne', SupplierController.name);
    return this.supplierService.getSupplierById(id, req);
  }

  /**
   * Updates a supplier
   * @param {string} id - Supplier ID
   * @param {UpdateSupplierDto} updateSupplierDto - Updated data
   * @param {Request} req - The Express request object
   * @returns {Promise<SupplierResponseDto>} Updated supplier
   */
  @Put(':id')
  async updateSupplier(
    @Param('id') id: string,
    @Body() updateSupplierDto: UpdateSupplierDto,
    @Req() req: Request
  ): Promise<SupplierResponseDto> {
    const logMessage = `Updating supplier with ID: ${id}`;
    this.fileLogger.log(logMessage, 'supplier-update', SupplierController.name);
    return this.supplierService.updateSupplier(id, updateSupplierDto, req);
  }

  /**
   * Deletes a supplier
   * @param {string} id - Supplier ID
   * @param {Request} req - The Express request object
   * @returns {Promise<void>}
   */
  @Delete(':id')
  async deleteSupplier(@Param('id') id: string, @Req() req: Request): Promise<void> {
    const logMessage = `Deleting supplier with ID: ${id}`;
    this.fileLogger.log(logMessage, 'supplier-remove', SupplierController.name);
    return this.supplierService.deleteSupplier(id, req);
  }
}
