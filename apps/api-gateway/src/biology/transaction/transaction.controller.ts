import { TransactionService } from './transaction.service';
import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { CreateBiologyTransactionDto } from '@app/shared';
import { TransactionBiologyResponseDto } from '@app/shared';
import { UpdateBiologyTransactionDto } from '@app/shared';

@Controller('bio/transaction')
export class TransactionController {

  constructor(private readonly TransactionService: TransactionService) {}

  @Post()
  async createTransaction(@Body() createTransaction: CreateBiologyTransactionDto): Promise<TransactionBiologyResponseDto> {
    return this.TransactionService.create(createTransaction);
  }

  @Get()
  async getAllTransaction(): Promise<TransactionBiologyResponseDto[]> {
    return this.TransactionService.findAll();
  }

  @Get(':id')
  async getTransactionById(@Param('id') id: string): Promise<TransactionBiologyResponseDto> {
    return this.TransactionService.findById(id);
  }

  @Put(':id')
  async updateTransaction(
    @Param('id') id: string,
    @Body() updateTransaction: UpdateBiologyTransactionDto
  ): Promise<TransactionBiologyResponseDto> {
    return this.TransactionService.updateTransaction(id, updateTransaction);
  }

  @Delete(':id')
  async DeleteTransaction(@Param('id') id: string): Promise<TransactionBiologyResponseDto> {
    return this.TransactionService.deleteTransaction(id);
  }

}
