import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InventoryItem } from '@app/shared';
import { Lot } from '@app/shared';
import { CreateInventoryItemDto } from './dto/create-inventory-item.dto';
import { UpdateInventoryItemDto } from './dto/update-inventory-item.dto';
import { InventoryItemCategory } from '@app/shared';
import { FileLoggerService } from '@app/shared';

/**
 * Interface for inventory item with calculated current stock
 */
  export interface InventoryItemWithStock extends InventoryItem {
    currentStock: number;
  }

/**
 * Service for managing inventory items in the dental inventory system
 *
 * This service provides comprehensive inventory item management functionality including:
 * - Creating new inventory items with category and storage condition specifications
 * - Retrieving inventory items with filtering and search capabilities
 * - Updating existing inventory item information
 * - Managing inventory item lifecycle and status
 * - Handling consumable and reusable item classifications
 *
 * The service ensures proper data validation, error handling, and maintains
 * referential integrity with related entities such as lots and storage locations.
 */
@Injectable()
export class InventoryItemService {
  private readonly logFileName = 'inventory-item';
  /**
   * Constructor for InventoryItemService
   * @param inventoryItemRepository - TypeORM repository for InventoryItem entity operations
   * @param lotRepository - TypeORM repository for Lot entity operations
   * @param logger - File logger service for logging inventory item operations
   */
  constructor(
    @InjectRepository(InventoryItem)
    private inventoryItemRepository: Repository<InventoryItem>,
    @InjectRepository(Lot)
    private lotRepository: Repository<Lot>,
    private readonly logger: FileLoggerService,
  ) {
    // Set the default log file name and context for this service
    this.logger.setLogFileName(this.logFileName);
    this.logger.setContext('InventoryItemService');
  }

  /**
   * Creates a new inventory item in the system
   * @param createInventoryItemDto - Data transfer object containing inventory item creation details
   * @returns Promise<InventoryItem> - The newly created inventory item entity
   * @throws Error if creation fails due to validation or database constraints
   */
  async create(
    createInventoryItemDto: CreateInventoryItemDto,
  ): Promise<InventoryItem> {
    try {
      this.logger.log(
        `Creating new inventory item: ${createInventoryItemDto.name}`,
      );
      const inventoryItem = this.inventoryItemRepository.create(
        createInventoryItemDto,
      );
      const savedItem = await this.inventoryItemRepository.save(inventoryItem);
      this.logger.log(
        `Successfully created inventory item with ID: ${savedItem.id}`,
      );
      return savedItem;
    } catch (error) {
      this.logger.error(
        `Failed to create inventory item: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }  /**
   * Retrieves all inventory items from the system with related lots and calculated current stock
   * @returns Promise<InventoryItemWithStock[]> - Array of all inventory item entities with lots and currentStock
   */
  async findAll(): Promise<InventoryItemWithStock[]> {
    try {
      this.logger.log('Retrieving all inventory items with lots and current stock');
      
      // Get all inventory items with their lots
      const items = await this.inventoryItemRepository.find({
        relations: ['lots'],
        order: { createdAt: 'DESC' },
      });

      // Calculate current stock for each item by summing lot quantities
      const itemsWithCurrentStock = items.map(item => ({
        ...item,
        currentStock: item.lots?.reduce((total, lot) => total + lot.quantity, 0) || 0,
      }));

      this.logger.log(`Retrieved ${items.length} inventory items with current stock calculated`);
      return itemsWithCurrentStock;
    } catch (error) {
      this.logger.error(
        `Failed to retrieve inventory items: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }  /**
   * Retrieves a specific inventory item by its unique identifier with related lots and current stock
   * @param id - UUID of the inventory item to retrieve
   * @returns Promise<InventoryItemWithStock> - The inventory item entity with lots and current stock
   * @throws NotFoundException if inventory item with specified ID is not found
   */
  async findOne(id: string): Promise<InventoryItemWithStock> {
    try {
      this.logger.log(`Retrieving inventory item with ID: ${id}`);
      const inventoryItem = await this.inventoryItemRepository.findOne({
        where: { id },
        relations: ['lots'],
      });

      if (!inventoryItem) {
        this.logger.warn(`Inventory item not found with ID: ${id}`);
        throw new NotFoundException(`Inventory item with ID ${id} not found`);
      }

      // Calculate current stock by summing lot quantities
      const currentStock = inventoryItem.lots?.reduce((total, lot) => total + lot.quantity, 0) || 0;

      this.logger.log(
        `Successfully retrieved inventory item: ${inventoryItem.name} with current stock: ${currentStock}`,
      );
      
      return {
        ...inventoryItem,
        currentStock,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        `Failed to retrieve inventory item with ID ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }  /**
   * Updates an existing inventory item with new information
   * @param id - UUID of the inventory item to update
   * @param updateInventoryItemDto - Data transfer object containing updated inventory item details
   * @returns Promise<InventoryItemWithStock> - The updated inventory item entity with current stock
   * @throws NotFoundException if inventory item with specified ID is not found
   */
  async update(
    id: string,
    updateInventoryItemDto: UpdateInventoryItemDto,
  ): Promise<InventoryItemWithStock> {
    try {
      this.logger.log(`Updating inventory item with ID: ${id}`);
      const inventoryItem = await this.inventoryItemRepository.findOne({
        where: { id },
        relations: ['lots'],
      });

      if (!inventoryItem) {
        this.logger.warn(`Inventory item not found with ID: ${id}`);
        throw new NotFoundException(`Inventory item with ID ${id} not found`);
      }

      Object.assign(inventoryItem, updateInventoryItemDto);
      const updatedItem = await this.inventoryItemRepository.save(inventoryItem);
      
      // Calculate current stock by summing lot quantities
      const currentStock = updatedItem.lots?.reduce((total, lot) => total + lot.quantity, 0) || 0;
      
      this.logger.log(`Successfully updated inventory item: ${updatedItem.name} with current stock: ${currentStock}`);
      
      return {
        ...updatedItem,
        currentStock,
      };
    } catch (error) {
      this.logger.error(
        `Failed to update inventory item with ID ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Removes an inventory item from the system
   * @param id - UUID of the inventory item to remove
   * @returns Promise<void>
   * @throws NotFoundException if inventory item with specified ID is not found
   */
  async remove(id: string): Promise<void> {
    try {
      this.logger.log(`Removing inventory item with ID: ${id}`);
      const inventoryItem = await this.findOne(id);
      await this.inventoryItemRepository.remove(inventoryItem);
      this.logger.log(`Successfully removed inventory item: ${inventoryItem.name}`);
    } catch (error) {
      this.logger.error(
        `Failed to remove inventory item with ID ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }  /**
   * Finds inventory items by category with related lots and current stock
   * @param category - The category to filter by
   * @returns Promise<InventoryItemWithStock[]> - Array of inventory items in the specified category with current stock
   */
  async findByCategory(
    category: InventoryItemCategory,
  ): Promise<InventoryItemWithStock[]> {
    const items = await this.inventoryItemRepository.find({
      where: { category },
      relations: ['lots'],
      order: { name: 'ASC' },
    });

    return items.map(item => ({
      ...item,
      currentStock: item.lots?.reduce((total, lot) => total + lot.quantity, 0) || 0,
    }));
  }
  /**
   * Finds consumable inventory items with related lots and current stock
   * @returns Promise<InventoryItemWithStock[]> - Array of consumable inventory items with current stock
   */
  async findConsumables(): Promise<InventoryItemWithStock[]> {
    const items = await this.inventoryItemRepository.find({
      where: { isConsumable: true },
      relations: ['lots'],
      order: { name: 'ASC' },
    });

    return items.map(item => ({
      ...item,
      currentStock: item.lots?.reduce((total, lot) => total + lot.quantity, 0) || 0,
    }));
  }
  /**
   * Finds reusable inventory items with related lots and current stock
   * @returns Promise<InventoryItemWithStock[]> - Array of reusable inventory items with current stock
   */
  async findReusables(): Promise<InventoryItemWithStock[]> {
    const items = await this.inventoryItemRepository.find({
      where: { isReusable: true },
      relations: ['lots'],
      order: { name: 'ASC' },
    });

    return items.map(item => ({
      ...item,
      currentStock: item.lots?.reduce((total, lot) => total + lot.quantity, 0) || 0,
    }));
  }
  /**
   * Searches inventory items by name (case-insensitive partial match) with related lots and current stock
   * @param searchTerm - The search term to match against item names
   * @returns Promise<InventoryItemWithStock[]> - Array of matching inventory items with current stock
   */
  async searchByName(searchTerm: string): Promise<InventoryItemWithStock[]> {
    const items = await this.inventoryItemRepository
      .createQueryBuilder('item')
      .leftJoinAndSelect('item.lots', 'lots')
      .where('LOWER(item.name) LIKE LOWER(:searchTerm)', {
        searchTerm: `%${searchTerm}%`,
      })
      .orderBy('item.name', 'ASC')
      .getMany();

    return items.map(item => ({
      ...item,
      currentStock: item.lots?.reduce((total, lot) => total + lot.quantity, 0) || 0,
    }));
  }
}
