import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { StorageService } from './storageLocation.service';
import { CreateBiologyStorageLocationDto } from '@app/shared';
import { StorageLocationBiologyResponseDto } from '@app/shared';
import { UpdateBiologyStorageLocationDto } from '@app/shared';

@Controller('bio/storage')
export class StorageController {

  constructor(private readonly StorageService: StorageService) {}

  @Post()
  async createStorage(@Body() createStorage: CreateBiologyStorageLocationDto): Promise<StorageLocationBiologyResponseDto> {
    return this.StorageService.create(createStorage);
  }

  @Get()
  async getAllStorage(): Promise<StorageLocationBiologyResponseDto[]> {
    return this.StorageService.findAll();
  }

  @Get(':id')
  async getStorageById(@Param('id') id: string): Promise<StorageLocationBiologyResponseDto> {
    return this.StorageService.findById(id);
  }

  @Put(':id')
  async updateStorage(
    @Param('id') id: string,
    @Body() updateStorageDto: UpdateBiologyStorageLocationDto
  ): Promise<StorageLocationBiologyResponseDto> {
    return this.StorageService.updateStorage(id, updateStorageDto);
  }

  @Delete(':id')
  async DeleteStorage(@Param('id') id: string): Promise<StorageLocationBiologyResponseDto> {
    return this.StorageService.deleteStorage(id);
  }

}