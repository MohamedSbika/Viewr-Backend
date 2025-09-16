import { Transaction } from '@app/shared';
import { Injectable, Logger, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { CreateBiologyTransactionDto } from '@app/shared';
import { UpdateBiologyTransactionDto } from '@app/shared';
import { TransactionBiologyResponseDto } from '@app/shared';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class TransactionService {
  private readonly logger = new Logger(TransactionService.name);

  constructor(
    @Inject('BIOLOGY_SERVICE') private readonly bioClient: ClientProxy
  ) {
    this.logger.log('Transaction Service initialized');
  }

  async create(createTransaction: CreateBiologyTransactionDto): Promise<TransactionBiologyResponseDto> {
    this.logger.log(`Sending request to create transaction: ${JSON.stringify(createTransaction)}`);
    try {
      const newTransaction = await firstValueFrom(
        this.bioClient.send<TransactionBiologyResponseDto, CreateBiologyTransactionDto>('transaction.create', createTransaction)
      );
      this.logger.log(`Received response for transaction creation: ${JSON.stringify(newTransaction)}`);
      return newTransaction;
    } catch (error) {
      this.logger.error(`Error during transaction creation RPC call: ${error.message}`, error.stack);

      throw new HttpException(error.response || {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);

    }
  }

  async findAll(): Promise<TransactionBiologyResponseDto[]> {
    this.logger.log(`Sending request to fetch all lot`);
    try {
      const Transaction = await firstValueFrom(
        this.bioClient.send<TransactionBiologyResponseDto[], {}>('transaction.findAll', {})
      );
      this.logger.log(`Received response for fetching all transaction: ${Transaction.length} found`);
      return Transaction;
    } catch (error) {
      this.logger.error(`Error during fetch all transaction RPC call: ${error.message}`, error.stack);

      throw new HttpException(error.response || {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);

    }
  }
  async findById(id: string): Promise<TransactionBiologyResponseDto> {

    try {
      const Transaction = await firstValueFrom(
        this.bioClient.send<TransactionBiologyResponseDto>('transaction.findOne', { id })
      );
      return Transaction;

    } catch (error) {
      this.logger.error(`Error during fetch Transaction RPC call: ${error.message}`, error.stack);
      throw new HttpException(error.response || {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);

    }
  }
async updateTransaction(id: string , data : UpdateBiologyTransactionDto): Promise<TransactionBiologyResponseDto> {
  console.log(data)
        try {
            const Transaction = await firstValueFrom(
                this.bioClient.send<TransactionBiologyResponseDto>('transaction.update', { id,updateTransaction:data })
            );
            return Transaction;

        } catch (error) {
            this.logger.error(`Error during Transaction RPC call: ${error.message}`, error.stack);
            throw new HttpException(error.response || {
              statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
              error: error.error,
              message: error.message
            }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
      
        }
    }
 async deleteTransaction(id: string): Promise<TransactionBiologyResponseDto> {

        try {
            const Transaction = await firstValueFrom(
                this.bioClient.send<TransactionBiologyResponseDto>('transaction.remove', { id })
            );
            return Transaction;

        } catch (error) {
            this.logger.error(`Error during deleting Transaction RPC call: ${error.message}`, error.stack);
            throw new HttpException(error.response || {
              statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
              error: error.error,
              message: error.message
            }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
      
        }
    }

}