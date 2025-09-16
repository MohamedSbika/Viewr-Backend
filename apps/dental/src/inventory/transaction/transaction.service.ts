import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from '@app/shared';
import { Lot } from '@app/shared';
import { TransactionType } from '../../Enums/transaction-type.enum';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { FileLoggerService } from '@app/shared';

/**
 * Service responsible for managing inventory transactions.
 * Handles creation, retrieval, update, and deletion of transactions,
 * and automatically updates lot lastUsedDate for OUT transactions.
 */
@Injectable()
export class TransactionService {
  private readonly logFileName = 'inventory-transaction';

  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(Lot)
    private readonly lotRepository: Repository<Lot>,
    private readonly logger: FileLoggerService,
  ) {
    // Set the default log file name and context for this service
    this.logger.setLogFileName(this.logFileName);
    this.logger.setContext('TransactionService');
  }

  /**
   * Creates a new transaction and updates related lot lastUsedDate if applicable.
   * @param createTransactionDto - Data transfer object containing transaction details
   * @returns Promise<Transaction> - The created transaction
   */
  async create(
    createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    try {
      this.logger.log(
        `Creating new transaction: ${createTransactionDto.type} for inventory item ${createTransactionDto.inventoryItemId}`,
      );
      const transaction = this.transactionRepository.create(createTransactionDto);
      const savedTransaction = await this.transactionRepository.save(transaction);
      this.logger.log(
        `Successfully created transaction with ID: ${savedTransaction.id}`,
      );

      // Update lastUsedDate for related lots if this is an OUT transaction
      if (createTransactionDto.type === TransactionType.OUT) {
        this.logger.log(
          'Updating lastUsedDate for related lots (OUT transaction)',
        );
        await this.updateRelatedLotsLastUsedDate(
          createTransactionDto.inventoryItemId,
          createTransactionDto.date,
        );
      }

      return savedTransaction;
    } catch (error) {
      this.logger.error(
        `Failed to create transaction: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Retrieves all transactions with their related inventory items.
   * @returns Promise<Transaction[]> - Array of all transactions
   */
  async findAll(): Promise<Transaction[]> {
    try {
      this.logger.log('Retrieving all transactions');
      const transactions = await this.transactionRepository.find({
        relations: ['inventoryItem'],
        order: { date: 'DESC' },
      });
      this.logger.log(`Retrieved ${transactions.length} transactions`);
      return transactions;
    } catch (error) {
      this.logger.error(
        `Failed to retrieve transactions: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Retrieves a specific transaction by ID.
   * @param id - The transaction ID
   * @returns Promise<Transaction> - The requested transaction
   * @throws NotFoundException if transaction is not found
   */
  async findOne(id: string): Promise<Transaction> {
    try {
      this.logger.log(`Retrieving transaction with ID: ${id}`);
      const transaction = await this.transactionRepository.findOne({
        where: { id },
        relations: ['inventoryItem'],
      });

      if (!transaction) {
        this.logger.warn(`Transaction not found with ID: ${id}`);
        throw new NotFoundException(`Transaction with ID ${id} not found`);
      }

      this.logger.log(
        `Successfully retrieved transaction: ${transaction.type} - ${transaction.id}`,
      );
      return transaction;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        `Failed to retrieve transaction with ID ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Retrieves all transactions for a specific inventory item.
   * @param inventoryItemId - The inventory item ID
   * @returns Promise<Transaction[]> - Array of transactions for the inventory item
   */
  async findByInventoryItem(inventoryItemId: string): Promise<Transaction[]> {
    return this.transactionRepository.find({
      where: { inventoryItemId },
      relations: ['inventoryItem'],
      order: { date: 'DESC' },
    });
  }

  /**
   * Retrieves transactions by type.
   * @param type - The transaction type to filter by
   * @returns Promise<Transaction[]> - Array of transactions of the specified type
   */
  async findByType(type: TransactionType): Promise<Transaction[]> {
    return this.transactionRepository.find({
      where: { type },
      relations: ['inventoryItem'],
      order: { date: 'DESC' },
    });
  }

  /**
   * Updates an existing transaction.
   * @param id - The transaction ID to update
   * @param updateTransactionDto - Data transfer object containing updated transaction details
   * @returns Promise<Transaction> - The updated transaction
   * @throws NotFoundException if transaction is not found
   */
  async update(
    id: string,
    updateTransactionDto: UpdateTransactionDto,
  ): Promise<Transaction> {
    const existingTransaction = await this.findOne(id);

    const updatedTransaction = await this.transactionRepository.save({
      ...existingTransaction,
      ...updateTransactionDto,
    });

    // Update lastUsedDate for related lots if this becomes an OUT transaction
    if (
      updateTransactionDto.type === TransactionType.OUT &&
      updateTransactionDto.date
    ) {
      await this.updateRelatedLotsLastUsedDate(
        updateTransactionDto.inventoryItemId ||
          existingTransaction.inventoryItemId,
        updateTransactionDto.date,
      );
    }

    return updatedTransaction;
  }

  /**
   * Removes a transaction by ID.
   * @param id - The transaction ID to remove
   * @returns Promise<void>
   * @throws NotFoundException if transaction is not found
   */
  async remove(id: string): Promise<void> {
    const transaction = await this.findOne(id);
    await this.transactionRepository.remove(transaction);
  }

  /**
   * Updates the lastUsedDate for all lots related to an inventory item.
   * This is called when an OUT transaction occurs.
   * @param inventoryItemId - The inventory item ID
   * @param transactionDate - The date of the transaction
   * @returns Promise<void>
   */
  private async updateRelatedLotsLastUsedDate(
    inventoryItemId: string,
    transactionDate: Date,
  ): Promise<void> {
    await this.lotRepository
      .createQueryBuilder()
      .update(Lot)
      .set({ lastUsedDate: transactionDate })
      .where('inventoryItemId = :inventoryItemId', { inventoryItemId })
      .execute();
  }

  /**
   * Calculates the total quantity for an inventory item based on all transactions.
   * @param inventoryItemId - The inventory item ID
   * @returns Promise<number> - The calculated total quantity
   */
  async calculateTotalQuantity(inventoryItemId: string): Promise<number> {
    const transactions = await this.findByInventoryItem(inventoryItemId);

    return transactions.reduce((total, transaction) => {
      switch (transaction.type) {
        case TransactionType.IN:
        case TransactionType.RETURN:
          return total + Number(transaction.quantity);
        case TransactionType.OUT:
          return total - Number(transaction.quantity);
        case TransactionType.ADJUSTMENT:
          // For adjustments, the quantity represents the final amount
          return Number(transaction.quantity);
        default:
          return total;
      }
    }, 0);
  }
}
