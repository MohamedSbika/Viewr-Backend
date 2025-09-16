import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { SupplierService } from './supplier.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { Supplier } from '@app/shared';
import { FileLoggerService } from '@app/shared';
import { RpcException } from '@nestjs/microservices';

@Controller()
export class SupplierController {
  constructor(
    private readonly supplierService: SupplierService,
    private readonly logger: FileLoggerService,
  ) {
    this.logger.setContext('SupplierController');
    this.logger.setLogFileName('supplier.log');
  }

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

  @MessagePattern('supplier.create')
  async create(createSupplierDto: CreateSupplierDto): Promise<Supplier> {
    try {
      this.logger.log(
        `Creating supplier: ${JSON.stringify(createSupplierDto)}`,
      );
      return await this.supplierService.create(createSupplierDto);
    } catch (error) {
      const errorMessage = this.getErrorMessage(error);
      const errorStack = this.getErrorStack(error);
      this.logger.error(`Error creating supplier: ${errorMessage}`, errorStack);
      throw new RpcException(errorMessage);
    }
  }
  @MessagePattern('supplier.findAll')
  async findAll(): Promise<Supplier[]> {
    try {
      this.logger.log('Finding all suppliers');
      return await this.supplierService.findAll();
    } catch (error) {
      const errorMessage = this.getErrorMessage(error);
      const errorStack = this.getErrorStack(error);
      this.logger.error(
        `Error finding all suppliers: ${errorMessage}`,
        errorStack,
      );
      throw new RpcException(errorMessage);
    }
  }
  @MessagePattern('supplier.findOne')
  async findOne(id: string): Promise<Supplier | null> {
    try {
      this.logger.log(`Finding supplier with id: ${id}`);
      return await this.supplierService.findOne(id);
    } catch (error) {
      const errorMessage = this.getErrorMessage(error);
      const errorStack = this.getErrorStack(error);
      this.logger.error(`Error finding supplier: ${errorMessage}`, errorStack);
      throw new RpcException(errorMessage);
    }
  }
  @MessagePattern('supplier.update')
  async update(data: {
    id: string;
    updateSupplierDto: UpdateSupplierDto;
  }): Promise<Supplier | null> {
    try {
      this.logger.log(`Updating supplier with id: ${data.id}`);
      return await this.supplierService.update(data.id, data.updateSupplierDto);
    } catch (error) {
      const errorMessage = this.getErrorMessage(error);
      const errorStack = this.getErrorStack(error);
      this.logger.error(`Error updating supplier: ${errorMessage}`, errorStack);
      throw new RpcException(errorMessage);
    }
  }
  @MessagePattern('supplier.remove')
  async remove(id: string): Promise<void> {
    try {
      this.logger.log(`Removing supplier with id: ${id}`);
      return await this.supplierService.remove(id);
    } catch (error) {
      const errorMessage = this.getErrorMessage(error);
      const errorStack = this.getErrorStack(error);
      this.logger.error(`Error removing supplier: ${errorMessage}`, errorStack);
      throw new RpcException(errorMessage);    }
  }
}
