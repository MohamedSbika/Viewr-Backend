import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FileLoggerService1, Supplier } from '@app/shared';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { FileLoggerService } from '@app/shared';

/**
 * Service responsible for managing suppliers in the dental inventory system
 *
 * Provides methods for creating, retrieving, updating, and deleting suppliers,
 * including CRUD operations and business logic for supplier management.
 */
@Injectable()
export class SupplierService {
  private readonly logFileName = 'inventory-supplier';

  /**
   * Creates an instance of the SupplierService
   *
   * @param supplierRepository - The TypeORM repository for Supplier entities
   * @param logger - File logger service for logging supplier operations
   */
  constructor(
    @InjectRepository(Supplier)
    private supplierRepository: Repository<Supplier>,
    private readonly logger: FileLoggerService1,
  ) {
    // Set the default log file name and context for this service
    this.logger.setLogFileName(this.logFileName);
    this.logger.setContext('SupplierService');
  }

  /**
   * Creates a new supplier in the system
   *
   * @param createSupplierDto - The data transfer object containing supplier details
   * @returns A promise that resolves to the newly created Supplier entity
   */
  async create(createSupplierDto: CreateSupplierDto): Promise<Supplier> {
    try {
      this.logger.log(`Creating new supplier: ${createSupplierDto.name}`);
      const supplier = this.supplierRepository.create(createSupplierDto);
      const savedSupplier = await this.supplierRepository.save(supplier);
      this.logger.log(`Successfully created supplier with ID: ${savedSupplier.id}`);
      return savedSupplier;
    } catch (error) {
      this.logger.error(`Failed to create supplier: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Retrieves all suppliers from the system
   *
   * @returns A promise that resolves to an array of all Supplier entities
   */
  async findAll(): Promise<Supplier[]> {
    try {
      this.logger.log('Retrieving all suppliers');
      const suppliers = await this.supplierRepository.find();
      this.logger.log(`Retrieved ${suppliers.length} suppliers`);
      return suppliers;
    } catch (error) {
      this.logger.error(`Failed to retrieve suppliers: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Finds a specific supplier by its unique identifier
   *
   * @param id - The UUID of the supplier to retrieve
   * @returns A promise that resolves to the found Supplier entity
   * @throws NotFoundException if supplier with specified ID is not found
   */
  async findOne(id: string): Promise<Supplier> {
    try {
      this.logger.log(`Retrieving supplier with ID: ${id}`);
      const supplier = await this.supplierRepository.findOneBy({ id });
      
      if (!supplier) {
        this.logger.warn(`Supplier not found with ID: ${id}`);
        throw new NotFoundException(`Supplier with ID ${id} not found`);
      }
      
      this.logger.log(`Successfully retrieved supplier: ${supplier.name}`);
      return supplier;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to retrieve supplier with ID ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Updates an existing supplier with new information
   *
   * @param id - The UUID of the supplier to update
   * @param updateSupplierDto - The data transfer object containing updated supplier details
   * @returns A promise that resolves to the updated Supplier entity
   * @throws NotFoundException if supplier with specified ID is not found
   */
  async update(
    id: string,
    updateSupplierDto: UpdateSupplierDto,
  ): Promise<Supplier> {
    try {
      this.logger.log(`Updating supplier with ID: ${id}`);
      const updateResult = await this.supplierRepository.update(id, updateSupplierDto);
      
      if (updateResult.affected === 0) {
        this.logger.warn(`Supplier not found for update with ID: ${id}`);
        throw new NotFoundException(`Supplier with ID ${id} not found`);
      }
      
      const updatedSupplier = await this.findOne(id);
      this.logger.log(`Successfully updated supplier: ${updatedSupplier.name}`);
      return updatedSupplier;
    } catch (error) {
      this.logger.error(`Failed to update supplier with ID ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Removes a supplier from the system
   *
   * @param id - The UUID of the supplier to remove
   * @returns A promise that resolves when the supplier has been successfully removed
   * @throws NotFoundException if supplier with specified ID is not found
   */
  async remove(id: string): Promise<void> {
    try {
      this.logger.log(`Removing supplier with ID: ${id}`);
      const supplier = await this.findOne(id); // This will throw if not found
      await this.supplierRepository.delete(id);
      this.logger.log(`Successfully removed supplier: ${supplier.name}`);
    } catch (error) {
      this.logger.error(`Failed to remove supplier with ID ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }
}
