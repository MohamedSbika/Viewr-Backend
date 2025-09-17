import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDentalLotDto, FileLoggerService1 } from '@app/shared';
import { UpdateLotRequestDto } from '@app/shared';
import { Lot } from '@app/shared';
import { SupplierService } from '../supplier/supplier.service';
import { FileLoggerService } from '@app/shared';

/**
 * Service responsible for managing inventory lots
 *
 * Provides methods for creating, retrieving, updating, and deleting lots,
 * as well as specialized queries for finding lots by various criteria.
 */
@Injectable()
export class LotService {
  private readonly logFileName = 'inventory-lot';

  /**
   * Creates an instance of the LotService
   *
   * @param lotRepository - The TypeORM repository for Lot entities
   * @param supplierService - The supplier service for handling supplier operations
   * @param logger - File logger service for logging lot operations
   */
  constructor(
    @InjectRepository(Lot)
    private lotRepository: Repository<Lot>,
    private readonly supplierService: SupplierService,
    private readonly logger: FileLoggerService1,
  ) {
    // Set the default log file name and context for this service
    this.logger.setLogFileName(this.logFileName);
    this.logger.setContext('LotService');
  }

  /**
   * Creates a new lot in the inventory system
   *
   * @param createLotDto - The data transfer object containing the lot details
   * @returns A promise that resolves to the newly created Lot entity
   */
  async create(createLotDto: CreateDentalLotDto): Promise<Lot> {
    try {
      this.logger.log(`Creating new lot for inventory item: ${createLotDto.inventoryItemId}`);
      
      // Handle the case where a new supplier is provided
      if (createLotDto.newSupplier && !createLotDto.supplierId) {
        this.logger.log('Creating new supplier for lot');
        const supplier = await this.supplierService.create(
          createLotDto.newSupplier,
        );
        createLotDto.supplierId = supplier.id;
        this.logger.log(`Created supplier with ID: ${supplier.id}`);
      } else if (!createLotDto.supplierId) {
        const errorMsg = 'Either supplierId or newSupplier must be provided';
        this.logger.error(errorMsg);
        throw new Error(errorMsg);
      }

      // Remove the newSupplier object before creating the lot
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { newSupplier: _, ...lotData } = createLotDto;

      const lot = this.lotRepository.create(lotData);
      const savedLot = await this.lotRepository.save(lot);
      this.logger.log(`Successfully created lot with ID: ${savedLot.id}`);
      return savedLot;
    } catch (error) {
      this.logger.error(`Failed to create lot: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Retrieves all lots from the inventory system
   *
   * @returns A promise that resolves to an array of all Lot entities
   */
  async findAll(): Promise<Lot[]> {
    try {
      this.logger.log('Retrieving all lots');
      const lots = await this.lotRepository.find();
      this.logger.log(`Retrieved ${lots.length} lots`);
      return lots;
    } catch (error) {
      this.logger.error(`Failed to retrieve lots: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Finds a specific lot by its unique identifier
   *
   * @param id - The UUID of the lot to retrieve
   * @returns A promise that resolves to the found Lot entity
   * @throws NotFoundException if the lot with the given id does not exist
   */
  async findOne(id: string): Promise<Lot> {
    try {
      this.logger.log(`Retrieving lot with ID: ${id}`);
      const lot = await this.lotRepository.findOne({ where: { id } });
      
      if (!lot) {
        this.logger.warn(`Lot not found with ID: ${id}`);
        throw new NotFoundException(`Lot with ID ${id} not found`);
      }
      
      this.logger.log(`Successfully retrieved lot with ID: ${lot.id}`);
      return lot;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to retrieve lot with ID ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Finds all lots associated with a specific inventory item
   *
   * @param inventoryItemId - The UUID of the inventory item
   * @returns A promise that resolves to an array of Lot entities associated with the inventory item
   */
  async findByInventoryItem(inventoryItemId: string): Promise<Lot[]> {
    return this.lotRepository.find({ where: { inventoryItemId } });
  }

  /**
   * Finds all lots stored in a specific storage location
   *
   * @param storageLocationId - The UUID of the storage location
   * @returns A promise that resolves to an array of Lot entities at the specified storage location
   */
  async findByStorageLocation(storageLocationId: string): Promise<Lot[]> {
    return this.lotRepository.find({ where: { storageLocationId } });
  }

  /**
   * Finds all lots provided by a specific supplier
   *
   * @param supplierId - The UUID of the supplier
   * @returns A promise that resolves to an array of Lot entities from the specified supplier
   */
  async findBySupplier(supplierId: string): Promise<Lot[]> {
    return this.lotRepository.find({ where: { supplierId } });
  }

  /**
   * Updates an existing lot with new information
   *
   * @param id - The UUID of the lot to update
   * @param updateLotDto - The data transfer object containing the updated lot details
   * @returns A promise that resolves to the updated Lot entity
   * @throws NotFoundException if the lot with the given id does not exist
   */
  async update(id: string, updateLotDto: UpdateLotRequestDto): Promise<Lot> {
    const lot = await this.findOne(id);
    Object.assign(lot, updateLotDto);
    return this.lotRepository.save(lot);
  }

  /**
   * Updates the lastUsedDate for all lots of a specific inventory item
   * This method is typically called when an OUT transaction occurs
   *
   * @param inventoryItemId - The UUID of the inventory item
   * @param usageDate - The date when the item was used
   * @returns A promise that resolves when the update is complete
   */
  async updateLastUsedDate(
    inventoryItemId: string,
    usageDate: Date,
  ): Promise<void> {
    await this.lotRepository
      .createQueryBuilder()
      .update(Lot)
      .set({ lastUsedDate: usageDate })
      .where('inventoryItemId = :inventoryItemId', { inventoryItemId })
      .execute();
  }

  /**
   * Removes a lot from the inventory system
   *
   * @param id - The UUID of the lot to remove
   * @returns A promise that resolves when the lot has been successfully removed
   * @throws NotFoundException if the lot with the given id does not exist
   */
  async remove(id: string): Promise<void> {
    const lot = await this.findOne(id);
    await this.lotRepository.remove(lot);
  }
}
