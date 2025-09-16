import { Injectable, Logger, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { CreateBiologySupplierDto } from '@app/shared';
import { UpdateBiologySupplierDto } from '@app/shared';
import { SupplierBiologyResponseDto } from '@app/shared';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class SupplierService {
  private readonly logger = new Logger(SupplierService.name);

  constructor(
    @Inject('BIOLOGY_SERVICE') private readonly bioClient: ClientProxy
  ) {
    this.logger.log('Supplier Service initialized');
  }

  async create(createSupplier: CreateBiologySupplierDto): Promise<SupplierBiologyResponseDto> {
    this.logger.log(`Sending request to create Supplier: ${JSON.stringify(createSupplier)}`);
    try {
      const newSupplier = await firstValueFrom(
        this.bioClient.send<SupplierBiologyResponseDto, CreateBiologySupplierDto>('supplier.create', createSupplier)
      );
      this.logger.log(`Received response for Supplier creation: ${JSON.stringify(newSupplier)}`);
      return newSupplier;
    } catch (error) {
      this.logger.error(`Error during Supplier creation RPC call: ${error.message}`, error.stack);

      throw new HttpException(error.response || {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);

    }
  }

  async findAll(): Promise<SupplierBiologyResponseDto[]> {
    this.logger.log(`Sending request to fetch all Supplier`);
    try {
      const Supplier = await firstValueFrom(
        this.bioClient.send<SupplierBiologyResponseDto[], {}>('supplier.findAll', {})
      );
      this.logger.log(`Received response for fetching all lot: ${Supplier.length} found`);
      return Supplier;
    } catch (error) {
      this.logger.error(`Error during fetch all Supplier RPC call: ${error.message}`, error.stack);

      throw new HttpException(error.response || {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);

    }
  }
  async findById(id: string): Promise<SupplierBiologyResponseDto> {

    try {
      const Supplier = await firstValueFrom(
        this.bioClient.send<SupplierBiologyResponseDto>('supplier.findOne', { id })
      );
      return Supplier;

    } catch (error) {
      this.logger.error(`Error during fetch Supplier RPC call: ${error.message}`, error.stack);
      throw new HttpException(error.response || {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);

    }
  }
  async updateSupplier(id: string, data: UpdateBiologySupplierDto): Promise<SupplierBiologyResponseDto> {
    console.log(data)
    try {
      const Supplier = await firstValueFrom(
        this.bioClient.send<SupplierBiologyResponseDto>('supplier.update', { id, updateSupplier: data })
      );
      return Supplier;

    } catch (error) {
      this.logger.error(`Error during Supplier RPC call: ${error.message}`, error.stack);
      throw new HttpException(error.response || {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);

    }
  }
  async deleteSupplier(id: string): Promise<SupplierBiologyResponseDto> {

    try {
      const Supplier = await firstValueFrom(
        this.bioClient.send<SupplierBiologyResponseDto>('supplier.remove', { id })
      );
      return Supplier;

    } catch (error) {
      this.logger.error(`Error during deleting Supplier RPC call: ${error.message}`, error.stack);
      throw new HttpException(error.response || {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);

    }
  }

}