import { Injectable, Logger, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { Request } from 'express';
import { CreateDentalTransactionDto } from '@app/shared';
import { UpdateTransactionDto } from '@app/shared';
import { TransactionResponseDto } from '@app/shared';
import { RabbitMQService } from '@app/shared';

@Injectable()
export class TransactionService {
  private readonly logger = new Logger(TransactionService.name);

  constructor(
    private readonly rabbitMQService: RabbitMQService
  ) {
    this.logger.log('Transaction Service initialized');
  }

  /**
   * Create a new transaction
   * @param {CreateDentalTransactionDto} createTransactionDto - Transaction data
   * @param {Request} request - Express request object containing headers
   * @returns {Promise<TransactionResponseDto>} The created transaction
   */
  async createTransaction(createTransactionDto: CreateDentalTransactionDto, request: Request): Promise<TransactionResponseDto> {
    try {
      this.logger.log(`Creating transaction for inventory item: ${createTransactionDto.inventoryItemId}`);
      const targetQueue = (request as any).targetQueue;
      this.logger.log(`Using queue: ${targetQueue} for transaction.create`);
      
      return await this.rabbitMQService.sendMessage(targetQueue, 'transaction.create', createTransactionDto);
    } catch (error) {
      this.logger.error(`Error creating transaction: ${error.message}`, error.stack);
      throw new HttpException(error.response || {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Get all transactions with optional filtering
   * @param {string} type - Filter by transaction type (optional)
   * @param {string} inventoryItemId - Filter by inventory item ID (optional)
   * @param {Request} request - Express request object containing headers
   * @returns {Promise<TransactionResponseDto[]>} List of transactions
   */
  async getAllTransactions(type: string, inventoryItemId: string, request: Request): Promise<TransactionResponseDto[]> {
    try {
      this.logger.log(`Getting all transactions with filters - type: ${type}, inventoryItemId: ${inventoryItemId}`);
      const targetQueue = (request as any).targetQueue;
      this.logger.log(`Using queue: ${targetQueue} for transaction.findAll`);
      
      const filters = {};
      if (type) filters['type'] = type;
      if (inventoryItemId) filters['inventoryItemId'] = inventoryItemId;
      
      return await this.rabbitMQService.sendMessage(targetQueue, 'transaction.findAll', filters);
    } catch (error) {
      this.logger.error(`Error getting all transactions: ${error.message}`, error.stack);
      throw new HttpException(error.response || {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Get transaction by ID
   * @param {string} id - Transaction ID
   * @param {Request} request - Express request object containing headers
   * @returns {Promise<TransactionResponseDto>} The transaction
   */  
  async getTransactionById(id: string, request: Request): Promise<TransactionResponseDto> {
    try {
      this.logger.log(`Getting transaction with ID: ${id}`);
      const targetQueue = (request as any).targetQueue;
      this.logger.log(`Using queue: ${targetQueue} for transaction.findOne`);
      
      return await this.rabbitMQService.sendMessage(targetQueue, 'transaction.findOne', { id });
    } catch (error) {
      this.logger.error(`Error getting transaction by ID: ${error.message}`, error.stack);
      throw new HttpException(error.response || {
        statusCode: HttpStatus.NOT_FOUND,
        error: 'Not Found',
        message: `Transaction with ID ${id} not found`
      }, error.status || HttpStatus.NOT_FOUND);
    }
  }

  /**
   * Update transaction
   * @param {string} id - Transaction ID
   * @param {UpdateTransactionDto} updateTransactionDto - Updated data
   * @param {Request} request - Express request object containing headers
   * @returns {Promise<TransactionResponseDto>} Updated transaction
   */
  async updateTransaction(id: string, updateTransactionDto: UpdateTransactionDto, request: Request): Promise<TransactionResponseDto> {
    try {
      this.logger.log(`Updating transaction with ID: ${id}`);
      const targetQueue = (request as any).targetQueue;
      this.logger.log(`Using queue: ${targetQueue} for transaction.update`);
      
      return await this.rabbitMQService.sendMessage(targetQueue, 'transaction.update', { id, updateTransactionDto });
    } catch (error) {
      this.logger.error(`Error updating transaction: ${error.message}`, error.stack);
      throw new HttpException(error.response || {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Delete transaction
   * @param {string} id - Transaction ID
   * @param {Request} request - Express request object containing headers
   * @returns {Promise<void>}
   */
  async deleteTransaction(id: string, request: Request): Promise<void> {
    try {
      this.logger.log(`Deleting transaction with ID: ${id}`);
      const targetQueue = (request as any).targetQueue;
      this.logger.log(`Using queue: ${targetQueue} for transaction.delete`);
      
      return await this.rabbitMQService.sendMessage(targetQueue, 'transaction.delete', id);
    } catch (error) {
      this.logger.error(`Error deleting transaction: ${error.message}`, error.stack);
      throw new HttpException(error.response || {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Get total quantity for an inventory item
   * @param {string} inventoryItemId - Inventory item ID
   * @param {Request} request - Express request object containing headers
   * @returns {Promise<any>} Total quantity information
   */  
  async getTotalQuantity(inventoryItemId: string, request: Request): Promise<any> {
    try {
      this.logger.log(`Getting total quantity for inventory item: ${inventoryItemId}`);
      const targetQueue = (request as any).targetQueue;
      this.logger.log(`Using queue: ${targetQueue} for transaction.getTotalQuantity`);
      
      return await this.rabbitMQService.sendMessage(targetQueue, 'transaction.getTotalQuantity', { inventoryItemId });
    } catch (error) {
      this.logger.error(`Error getting total quantity: ${error.message}`, error.stack);
      throw new HttpException(error.response || {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
