import { Injectable, Logger, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { Request } from 'express';
import { CreateDentalSupplierDto } from '@app/shared';
import { UpdateSupplierDto } from '@app/shared';
import { SupplierResponseDto } from '@app/shared';
import { RabbitMQService } from '@app/shared';

@Injectable()
export class SupplierService {
  private readonly logger = new Logger(SupplierService.name);

  constructor(
    @Inject('DENTIST_SERVICE') private readonly dentistClient: ClientProxy,
    private readonly rabbitMQService: RabbitMQService
  ) {
    this.logger.log('Supplier Service initialized');
  }

  /**
   * Create a new supplier
   * @param {CreateDentalSupplierDto} createSupplierDto - Supplier data
   * @param {Request} request - Express request object containing headers
   * @returns {Promise<SupplierResponseDto>} The created supplier
   */
  async createSupplier(createSupplierDto: CreateDentalSupplierDto, request: Request): Promise<SupplierResponseDto> {
    try {
      this.logger.log(`Creating supplier: ${createSupplierDto.name}`);
      const targetQueue = (request as any).targetQueue;
      this.logger.log(`Using queue: ${targetQueue} for supplier.create`);
      
      return await this.rabbitMQService.sendMessage(targetQueue, 'supplier.create', createSupplierDto);
    } catch (error) {
      this.logger.error(`Error creating supplier: ${error.message}`, error.stack);
      throw new HttpException(error.response || {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Get all suppliers
   * @param {Request} request - Express request object containing headers
   * @returns {Promise<SupplierResponseDto[]>} List of all suppliers
   */
  async getAllSuppliers(request: Request): Promise<SupplierResponseDto[]> {
    try {
      this.logger.log('Getting all suppliers');
      const targetQueue = (request as any).targetQueue;
      this.logger.log(`Using queue: ${targetQueue} for supplier.findAll`);
      
      return await this.rabbitMQService.sendMessage(targetQueue, 'supplier.findAll', {});
    } catch (error) {
      this.logger.error(`Error getting all suppliers: ${error.message}`, error.stack);
      throw new HttpException(error.response || {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Get supplier by ID
   * @param {string} id - Supplier ID
   * @param {Request} request - Express request object containing headers
   * @returns {Promise<SupplierResponseDto>} The supplier
   */
  async getSupplierById(id: string, request: Request): Promise<SupplierResponseDto> {
    try {
      this.logger.log(`Getting supplier with ID: ${id}`);
      const targetQueue = (request as any).targetQueue;
      this.logger.log(`Using queue: ${targetQueue} for supplier.findOne`);
      
      return await this.rabbitMQService.sendMessage(targetQueue, 'supplier.findOne', id);
    } catch (error) {
      this.logger.error(`Error getting supplier by ID: ${error.message}`, error.stack);
      throw new HttpException(error.response || {
        statusCode: HttpStatus.NOT_FOUND,
        error: 'Not Found',
        message: `Supplier with ID ${id} not found`
      }, error.status || HttpStatus.NOT_FOUND);
    }
  }

  /**
   * Update supplier
   * @param {string} id - Supplier ID
   * @param {UpdateSupplierDto} updateSupplierDto - Updated data
   * @param {Request} request - Express request object containing headers
   * @returns {Promise<SupplierResponseDto>} Updated supplier
   */
  async updateSupplier(id: string, updateSupplierDto: UpdateSupplierDto, request: Request): Promise<SupplierResponseDto> {
    try {
      this.logger.log(`Updating supplier with ID: ${id}`);
      const targetQueue = (request as any).targetQueue;
      this.logger.log(`Using queue: ${targetQueue} for supplier.update`);
      
      return await this.rabbitMQService.sendMessage(targetQueue, 'supplier.update', { id, updateSupplierDto });
    } catch (error) {
      this.logger.error(`Error updating supplier: ${error.message}`, error.stack);
      throw new HttpException(error.response || {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Delete supplier
   * @param {string} id - Supplier ID
   * @param {Request} request - Express request object containing headers
   * @returns {Promise<void>}
   */
  async deleteSupplier(id: string, request: Request): Promise<void> {
    try {
      this.logger.log(`Deleting supplier with ID: ${id}`);
      const targetQueue = (request as any).targetQueue;
      this.logger.log(`Using queue: ${targetQueue} for supplier.remove`);
      
      return await this.rabbitMQService.sendMessage(targetQueue, 'supplier.remove', id);
    } catch (error) {
      this.logger.error(`Error deleting supplier: ${error.message}`, error.stack);
      throw new HttpException(error.response || {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
