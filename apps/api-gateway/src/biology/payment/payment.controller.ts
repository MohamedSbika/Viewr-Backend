import { paymentService } from './payment.service';
import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { PaymentResponseDto } from '@app/shared';
import { CreatePaymentDto } from '@app/shared';
import { UpdatePaymentDto } from '@app/shared';

@Controller('bio/payment')
export class PaymentController {

  constructor(private readonly paymentService: paymentService) {}

  @Post()
  async createPayment(@Body() createPayment: CreatePaymentDto): Promise<PaymentResponseDto> {
    return this.paymentService.create(createPayment);
  }

  @Get()
  async getAllPayment(): Promise<PaymentResponseDto[]> {
    return this.paymentService.findAll();
  }

  @Get(':id')
  async getPaymentById(@Param('id') id: string): Promise<PaymentResponseDto> {
    return this.paymentService.findById(id);
  }

  @Put(':id')
  async updatePayment(
    @Param('id') id: string,
    @Body() updatePaymentDto: UpdatePaymentDto
  ): Promise<PaymentResponseDto> {
    return this.paymentService.updatePayment(id, updatePaymentDto);
  }

  @Delete(':id')
  async DeletePayment(@Param('id') id: string): Promise<PaymentResponseDto> {
    return this.paymentService.deletePayment(id);
  }

}
