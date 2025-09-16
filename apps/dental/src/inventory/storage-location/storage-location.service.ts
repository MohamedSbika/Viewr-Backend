import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { StorageLocation } from '../../entities/storage-location.entity';
import { CreateStorageLocationDto } from './dto/create-storage-location.dto';
import { UpdateStorageLocationDto } from './dto/update-storage-location.dto';
import { StorageLocationStatus } from '@app/shared';
import { FileLoggerService } from '@app/shared';

/**
 * Service responsible for managing storage locations in the dental inventory system
 *
 * Provides methods for creating, retrieving, updating, and deleting storage locations,
 * including specialized operations like merging locations using database transactions.
 */
@Injectable()
export class StorageLocationService {
  private readonly logFileName = 'inventory-storage-location';

  /**
   * Creates an instance of the StorageLocationService
   *
   * @param storageLocationRepository - The TypeORM repository for StorageLocation entities
   * @param dataSource - The TypeORM DataSource for advanced database operations and transactions
   * @param logger - File logger service for logging storage location operations
   */
  constructor(
    @InjectRepository(StorageLocation)
    private storageLocationRepository: Repository<StorageLocation>,
    private dataSource: DataSource,
    private readonly logger: FileLoggerService,
  ) {
    // Set the default log file name and context for this service
    this.logger.setLogFileName(this.logFileName);
    this.logger.setContext('StorageLocationService');
  }

  /**
   * Retrieves all storage locations from the system
   *
   * @returns A promise that resolves to an array of all StorageLocation entities
   */
  async findAll(): Promise<StorageLocation[]> {
    try {
      this.logger.log('Retrieving all storage locations');
      const locations = await this.storageLocationRepository.find();
      this.logger.log(`Retrieved ${locations.length} storage locations`);
      return locations;
    } catch (error) {
      this.logger.error(
        `Failed to retrieve storage locations: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Finds a specific storage location by its unique identifier
   *
   * @param id - The UUID of the storage location to retrieve
   * @returns A promise that resolves to the found StorageLocation entity
   * @throws NotFoundException if the storage location with the given id does not exist
   */
  async findOne(id: string): Promise<StorageLocation> {
    try {
      this.logger.log(`Retrieving storage location with ID: ${id}`);
      const storageLocation = await this.storageLocationRepository.findOne({
        where: { id },
      });

      if (!storageLocation) {
        this.logger.warn(`Storage location not found with ID: ${id}`);
        throw new NotFoundException(`Storage location with ID ${id} not found`);
      }      this.logger.log(
        `Successfully retrieved storage location: ${storageLocation.locationName}`,
      );
      return storageLocation;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        `Failed to retrieve storage location with ID ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Creates a new storage location in the system
   *
   * @param createDto - The data transfer object containing storage location details
   * @returns A promise that resolves to the newly created StorageLocation entity
   */
  async create(createDto: CreateStorageLocationDto): Promise<StorageLocation> {
    try {
      this.logger.log(`Creating new storage location: ${createDto.locationName}`);
      const newStorageLocation = this.storageLocationRepository.create(createDto);
      const savedLocation = await this.storageLocationRepository.save(
        newStorageLocation,
      );
      this.logger.log(
        `Successfully created storage location with ID: ${savedLocation.id}`,
      );
      return savedLocation;
    } catch (error) {
      this.logger.error(
        `Failed to create storage location: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Updates an existing storage location with new information
   *
   * @param id - The UUID of the storage location to update
   * @param updateDto - The data transfer object containing updated storage location details
   * @returns A promise that resolves to the updated StorageLocation entity
   * @throws NotFoundException if the storage location with the given id does not exist
   */
  async update(
    id: string,
    updateDto: UpdateStorageLocationDto,
  ): Promise<StorageLocation> {
    try {
      this.logger.log(`Updating storage location with ID: ${id}`);
      const updateResult = await this.storageLocationRepository.update(
        id,
        updateDto,
      );

      if (updateResult.affected === 0) {
        this.logger.warn(`Storage location not found for update with ID: ${id}`);
        throw new NotFoundException(`Storage location with ID ${id} not found`);
      }

      const updatedLocation = await this.findOne(id);      this.logger.log(
        `Successfully updated storage location: ${updatedLocation.locationName}`,
      );
      return updatedLocation;
    } catch (error) {
      this.logger.error(
        `Failed to update storage location with ID ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Removes a storage location from the system
   *
   * @param id - The UUID of the storage location to remove
   * @returns A promise that resolves when the storage location has been successfully removed
   * @throws NotFoundException if the storage location with the given id does not exist
   */
  async remove(id: string): Promise<void> {
    const deleteResult = await this.storageLocationRepository.delete(id);
    if (deleteResult.affected === 0) {
      throw new NotFoundException(`Storage location with ID ${id} not found`);
    }
  }

  /**
   * Merges two storage locations by moving items from source to target location
   * Uses database transactions to ensure data consistency during the merge operation
   *
   * @param sourceLocationId - The UUID of the source storage location to merge from
   * @param targetLocationId - The UUID of the target storage location to merge into
   * @returns A promise that resolves when the merge operation is complete
   * @throws NotFoundException if either source or target location does not exist
   */
  async mergeLocations(
    sourceLocationId: string,
    targetLocationId: string,
  ): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      // Start transaction
      await queryRunner.connect();
      await queryRunner.startTransaction();

      // Check if both locations exist
      const sourceLocation = await queryRunner.manager.findOne(
        StorageLocation,
        {
          where: { id: sourceLocationId },
        },
      );

      if (!sourceLocation) {
        throw new NotFoundException(
          `Source storage location with ID ${sourceLocationId} not found`,
        );
      }

      const targetLocation = await queryRunner.manager.findOne(
        StorageLocation,
        {
          where: { id: targetLocationId },
        },
      );

      if (!targetLocation) {
        throw new NotFoundException(
          `Target storage location with ID ${targetLocationId} not found`,
        );
      }

      // Here you would implement the actual logic to move items from source to target
      // For example:
      // await queryRunner.manager.update(InventoryItem,
      //   { storageLocationId: sourceLocationId },
      //   { storageLocationId: targetLocationId }
      // );

      // Mark the source location as EXPIRED
      await queryRunner.manager.update(StorageLocation, sourceLocationId, {
        status: StorageLocationStatus.EXPIRED,
      });

      // Commit the transaction
      await queryRunner.commitTransaction();
    } catch (error) {
      // Rollback the transaction in case of error
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // Release the query runner
      await queryRunner.release();
    }
  }
}
