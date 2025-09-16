import { Injectable, Logger, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { CreatePaymentDto } from '@app/shared';
import { UpdatePaymentDto } from '@app/shared';
import { PaymentResponseDto } from '@app/shared';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class paymentService {
  private readonly logger = new Logger(paymentService.name);

  constructor(
    @Inject('BIOLOGY_SERVICE') private readonly bioClient: ClientProxy
  ) {
    this.logger.log('payment Service initialized');
  }

  async create(createPaymentDto: CreatePaymentDto): Promise<PaymentResponseDto> {
    this.logger.log(`Sending request to create payment: ${JSON.stringify(createPaymentDto)}`);
    try {
      const newPayment = await firstValueFrom(
        this.bioClient.send<PaymentResponseDto, CreatePaymentDto>('payment.create', createPaymentDto)
      );
      this.logger.log(`Received response for payment creation: ${JSON.stringify(newPayment)}`);
      return newPayment;
    } catch (error) {
      this.logger.error(`Error during payment creation RPC call: ${error.message}`, error.stack);

      throw new HttpException(error.response || {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);

    }
  }

  async findAll(): Promise<PaymentResponseDto[]> {
    this.logger.log(`Sending request to fetch all payment`);
    try {
      const payment = await firstValueFrom(
        this.bioClient.send<PaymentResponseDto[], {}>('payment.findAll', {})
      );
      this.logger.log(`Received response for fetching all payment: ${payment.length} found`);
      return payment;
    } catch (error) {
      this.logger.error(`Error during fetch all payment RPC call: ${error.message}`, error.stack);

      throw new HttpException(error.response || {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);

    }
  }
  async findById(id: string): Promise<PaymentResponseDto> {

    try {
      const payment = await firstValueFrom(
        this.bioClient.send<PaymentResponseDto>('payment.findOne', { id })
      );
      return payment;

    } catch (error) {
      this.logger.error(`Error during fetch payment RPC call: ${error.message}`, error.stack);
      throw new HttpException(error.response || {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);

    }
  }
async updatePayment(id: string , data : UpdatePaymentDto): Promise<PaymentResponseDto> {
  console.log(data)
        try {
            const Payment = await firstValueFrom(
                this.bioClient.send<PaymentResponseDto>('payment.update', { id,updatePaymentDto:data })
            );
            return Payment;

        } catch (error) {
            this.logger.error(`Error during task payment RPC call: ${error.message}`, error.stack);
            throw new HttpException(error.response || {
              statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
              error: error.error,
              message: error.message
            }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
      
        }
    }
 async deletePayment(id: string): Promise<PaymentResponseDto> {

        try {
            const Payment = await firstValueFrom(
                this.bioClient.send<PaymentResponseDto>('payment.remove', { id })
            );
            return Payment;

        } catch (error) {
            this.logger.error(`Error during deleting payment RPC call: ${error.message}`, error.stack);
            throw new HttpException(error.response || {
              statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
              error: error.error,
              message: error.message
            }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
      
        }
    }

}