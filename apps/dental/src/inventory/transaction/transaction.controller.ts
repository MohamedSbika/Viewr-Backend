import { Controller, HttpStatus, NotFoundException } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionType } from '@app/shared';
import { FileLoggerService } from '@app/shared';

@Controller()
export class TransactionController {
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
    private readonly transactionService: TransactionService,
    private readonly logger: FileLoggerService,
  ) {
    this.logger.setContext('TransactionController');
    this.logger.setLogFileName(this.logFileName);
  }

  @MessagePattern('transaction.create')
  async create(@Payload() createTransactionDto: CreateTransactionDto) {
    this.logger.log(
      `Creating new transaction: ${JSON.stringify(createTransactionDto)}`,
      this.logFileName,
      'create',
    );

    try {
      return await this.transactionService.create(createTransactionDto);
    } catch (error) {
      const errorMessage = this.getErrorMessage(error);
      const errorStack = this.getErrorStack(error);
      this.logger.error(
        `Error creating transaction: ${errorMessage}`,
        errorStack,
      );
      throw new RpcException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Internal Server Error',
        message: errorMessage,
      });
    }
  }

  @MessagePattern('transaction.findAll')
  async findAll() {
    this.logger.log(
      'Retrieving all transactions',
      this.logFileName,
      'findAll',
    );

    try {
      return await this.transactionService.findAll();
    } catch (error) {
      const errorMessage = this.getErrorMessage(error);
      const errorStack = this.getErrorStack(error);
      this.logger.error(
        `Error retrieving transactions: ${errorMessage}`,
        errorStack,
      );
      throw new RpcException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Internal Server Error',
        message: errorMessage,
      });
    }
  }

  @MessagePattern('transaction.findOne')
  async findOne(@Payload() data: { id: string }) {
    this.logger.log(
      `Retrieving transaction with ID: ${data.id}`,
      this.logFileName,
      'findOne',
    );

    try {
      return await this.transactionService.findOne(data.id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        const errorMessage = this.getErrorMessage(error);
        this.logger.warn(`Transaction not found: ${errorMessage}`);
        throw new RpcException({
          statusCode: HttpStatus.NOT_FOUND,
          error: 'Not Found',
          message: errorMessage,
        });
      }

      const errorMessage = this.getErrorMessage(error);
      const errorStack = this.getErrorStack(error);
      this.logger.error(
        `Error retrieving transaction: ${errorMessage}`,
        errorStack,
      );
      throw new RpcException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Internal Server Error',
        message: errorMessage,
      });
    }
  }

  @MessagePattern('transaction.findByType')
  async findByType(@Payload() data: { type: TransactionType }) {
    this.logger.log(
      `Retrieving transactions by type: ${data.type}`,
      this.logFileName,
      'findByType',
    );

    try {
      return await this.transactionService.findByType(data.type);
    } catch (error) {
      const errorMessage = this.getErrorMessage(error);
      const errorStack = this.getErrorStack(error);
      this.logger.error(
        `Error retrieving transactions by type: ${errorMessage}`,
        errorStack,
      );
      throw new RpcException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Internal Server Error',
        message: errorMessage,
      });
    }
  }

  @MessagePattern('transaction.findByInventoryItem')
  async findByInventoryItem(@Payload() data: { inventoryItemId: string }) {
    this.logger.log(
      `Retrieving transactions for inventory item: ${data.inventoryItemId}`,
      this.logFileName,
      'findByInventoryItem',
    );

    try {
      return await this.transactionService.findByInventoryItem(data.inventoryItemId);
    } catch (error) {
      const errorMessage = this.getErrorMessage(error);
      const errorStack = this.getErrorStack(error);
      this.logger.error(
        `Error retrieving transactions by inventory item: ${errorMessage}`,
        errorStack,
      );
      throw new RpcException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Internal Server Error',
        message: errorMessage,
      });
    }
  }

  @MessagePattern('transaction.getTotalQuantity')
  async getTotalQuantity(@Payload() data: { inventoryItemId: string }) {
    this.logger.log(
      `Calculating total quantity for inventory item: ${data.inventoryItemId}`,
      this.logFileName,
      'getTotalQuantity',
    );

    try {
      const totalQuantity = await this.transactionService.calculateTotalQuantity(data.inventoryItemId);
      return { inventoryItemId: data.inventoryItemId, totalQuantity };
    } catch (error) {
      const errorMessage = this.getErrorMessage(error);
      const errorStack = this.getErrorStack(error);
      this.logger.error(
        `Error calculating total quantity: ${errorMessage}`,
        errorStack,
      );
      throw new RpcException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Internal Server Error',
        message: errorMessage,
      });
    }
  }

  @MessagePattern('transaction.update')
  async update(
    @Payload()
    data: {
      id: string;
      updateTransactionDto: UpdateTransactionDto;
    },
  ) {
    this.logger.log(
      `Updating transaction ${data.id}: ${JSON.stringify(data.updateTransactionDto)}`,
      this.logFileName,
      'update',
    );

    try {
      return await this.transactionService.update(data.id, data.updateTransactionDto);
    } catch (error) {
      if (error instanceof NotFoundException) {
        const errorMessage = this.getErrorMessage(error);
        this.logger.warn(`Transaction not found for update: ${errorMessage}`);
        throw new RpcException({
          statusCode: HttpStatus.NOT_FOUND,
          error: 'Not Found',
          message: errorMessage,
        });
      }

      const errorMessage = this.getErrorMessage(error);
      const errorStack = this.getErrorStack(error);
      this.logger.error(
        `Error updating transaction: ${errorMessage}`,
        errorStack,
      );
      throw new RpcException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Internal Server Error',
        message: errorMessage,
      });
    }
  }

  @MessagePattern('transaction.remove')
  async remove(@Payload() data: { id: string }) {
    this.logger.log(
      `Removing transaction with ID: ${data.id}`,
      this.logFileName,
      'remove',
    );

    try {
      await this.transactionService.remove(data.id);
      return { message: 'Transaction deleted successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        const errorMessage = this.getErrorMessage(error);
        this.logger.warn(`Transaction not found for deletion: ${errorMessage}`);
        throw new RpcException({
          statusCode: HttpStatus.NOT_FOUND,
          error: 'Not Found',
          message: errorMessage,
        });
      }

      const errorMessage = this.getErrorMessage(error);
      const errorStack = this.getErrorStack(error);
      this.logger.error(
        `Error removing transaction: ${errorMessage}`,
        errorStack,
      );
      throw new RpcException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Internal Server Error',
        message: errorMessage,
      });    }
  }
}
