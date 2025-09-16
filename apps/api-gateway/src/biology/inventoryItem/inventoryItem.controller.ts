import { InventoryItemService } from './inventoryItem.service';
import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { CreateBiologyInventoryItemDto ,InventoryItemBiologyResponseDto,UpdateBiologyInventoryItemDto } from '@app/shared';

@Controller('bio/item')
export class ItemController {

  constructor(private readonly InventoryItemService: InventoryItemService) {}

  @Post()
  async createItem(@Body() createItem: CreateBiologyInventoryItemDto): Promise<InventoryItemBiologyResponseDto> {
    return this.InventoryItemService.create(createItem);
  }

  @Get()
  async getAllItem(): Promise<InventoryItemBiologyResponseDto[]> {
    return this.InventoryItemService.findAll();
  }

  @Get(':id')
  async getItemById(@Param('id') id: string): Promise<InventoryItemBiologyResponseDto> {
    return this.InventoryItemService.findById(id);
  }

  @Put(':id')
  async updateItem(
    @Param('id') id: string,
    @Body() updateItem: UpdateBiologyInventoryItemDto
  ): Promise<InventoryItemBiologyResponseDto> {
    // Ensure 'name' is always a string
    if (typeof updateItem.name !== 'string') {
      throw new Error("The 'name' property is required and must be a string.");
    }
    return this.InventoryItemService.updateItem(id, updateItem as any);
  }

  @Delete(':id')
  async DeleteItem(@Param('id') id: string): Promise<InventoryItemBiologyResponseDto> {
    return this.InventoryItemService.deleteItem(id);
  }

}
