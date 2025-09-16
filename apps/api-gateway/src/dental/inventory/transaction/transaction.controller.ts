import { Controller, Get, Post, Body, Param, Patch, Delete, Logger, Inject, Query, Req } from '@nestjs/common';
import type { Request } from 'express';
import { TransactionService } from './transaction.service';
import { CreateDentalTransactionDto } from '@app/shared';
import { UpdateTransactionDto } from '@app/shared';
import { TransactionResponseDto } from '@app/shared';
import { FileLoggerService } from '@app/shared';

@Controller('dentist/inventory/transactions')
export class TransactionController {
  private readonly logger = new Logger(TransactionController.name);

  constructor(
    private readonly transactionService: TransactionService,
    @Inject('FileLogger') private readonly fileLogger: FileLoggerService
  ) {
    this.logger.log('Transaction controller initialized');
  }

  /**
   * Creates a new transaction
   * @param {CreateDentalTransactionDto} createTransactionDto - The transaction data
   * @param {Request} req - The Express request object
   * @returns {Promise<TransactionResponseDto>} Created transaction information
   */
  @Post()
  async createTransaction(@Body() createTransactionDto: CreateDentalTransactionDto, @Req() req: Request): Promise<TransactionResponseDto> {
    const logMessage = `Creating transaction for inventory item: ${createTransactionDto.inventoryItemId}`;
    this.fileLogger.log(logMessage, 'transaction-create', TransactionController.name);
    return this.transactionService.createTransaction(createTransactionDto, req);
  }

  /**
   * Gets all transactions
   * @param {string} type - Filter by transaction type (optional)
   * @param {string} inventoryItemId - Filter by inventory item ID (optional)
   * @param {Request} req - The Express request object
   * @returns {Promise<TransactionResponseDto[]>} List of transactions
   */
  @Get()
  async getAllTransactions(
    @Query('type') type: string,
    @Query('inventoryItemId') inventoryItemId: string,
    @Req() req: Request
  ): Promise<TransactionResponseDto[]> {
    const logMessage = `Getting all transactions with filters - type: ${type}, inventoryItemId: ${inventoryItemId}`;
    this.fileLogger.log(logMessage, 'transaction-findAll', TransactionController.name);
    return this.transactionService.getAllTransactions(type, inventoryItemId, req);
  }

  /**
   * Gets a specific transaction by ID
   * @param {string} id - Transaction ID
   * @param {Request} req - The Express request object
   * @returns {Promise<TransactionResponseDto>} The transaction details
   */
  @Get(':id')
  async getTransactionById(@Param('id') id: string, @Req() req: Request): Promise<TransactionResponseDto> {
    const logMessage = `Getting transaction with ID: ${id}`;
    this.fileLogger.log(logMessage, 'transaction-findOne', TransactionController.name);
    return this.transactionService.getTransactionById(id, req);
  }

  /**
   * Updates a transaction
   * @param {string} id - Transaction ID
   * @param {UpdateTransactionDto} updateTransactionDto - Updated data
   * @param {Request} req - The Express request object
   * @returns {Promise<TransactionResponseDto>} Updated transaction
   */
  @Patch(':id')
  async updateTransaction(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
    @Req() req: Request
  ): Promise<TransactionResponseDto> {
    const logMessage = `Updating transaction with ID: ${id}`;
    this.fileLogger.log(logMessage, 'transaction-update', TransactionController.name);
    return this.transactionService.updateTransaction(id, updateTransactionDto, req);
  }

  /**
   * Deletes a transaction
   * @param {string} id - Transaction ID
   * @param {Request} req - The Express request object
   * @returns {Promise<void>}
   */
  @Delete(':id')
  async deleteTransaction(@Param('id') id: string, @Req() req: Request): Promise<void> {
    const logMessage = `Deleting transaction with ID: ${id}`;
    this.fileLogger.log(logMessage, 'transaction-delete', TransactionController.name);
    return this.transactionService.deleteTransaction(id, req);
  }

  /**
   * Gets total quantity for an inventory item
   * @param {string} inventoryItemId - Inventory item ID
   * @param {Request} req - The Express request object
   * @returns {Promise<any>} Total quantity information
   */
  @Get(':inventoryItemId/total-quantity')
  async getTotalQuantity(@Param('inventoryItemId') inventoryItemId: string, @Req() req: Request): Promise<any> {
    const logMessage = `Getting total quantity for inventory item: ${inventoryItemId}`;
    this.fileLogger.log(logMessage, 'transaction-getTotalQuantity', TransactionController.name);
    return this.transactionService.getTotalQuantity(inventoryItemId, req);
  }
}
