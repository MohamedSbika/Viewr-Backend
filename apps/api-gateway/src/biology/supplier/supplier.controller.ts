import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { CreateBiologySupplierDto } from '@app/shared';
import { SupplierBiologyResponseDto } from '@app/shared';
import { UpdateBiologySupplierDto } from '@app/shared';

@Controller('bio/supplier')
export class SupplierController {

  constructor(private readonly SupplierService: SupplierService) {}

  @Post()
  async createSupplier(@Body() createSupplier: CreateBiologySupplierDto): Promise<SupplierBiologyResponseDto> {
    return this.SupplierService.create(createSupplier);
  }

  @Get()
  async getAllSupplier(): Promise<SupplierBiologyResponseDto[]> {
    return this.SupplierService.findAll();
  }

  @Get(':id')
  async getSupplierById(@Param('id') id: string): Promise<SupplierBiologyResponseDto> {
    return this.SupplierService.findById(id);
  }

  @Put(':id')
  async updateSupplier(
    @Param('id') id: string,
    @Body() updateSupplierDto: UpdateBiologySupplierDto
  ): Promise<SupplierBiologyResponseDto> {
    return this.SupplierService.updateSupplier(id, updateSupplierDto);
  }

  @Delete(':id')
  async DeleteSupplier(@Param('id') id: string): Promise<SupplierBiologyResponseDto> {
    return this.SupplierService.deleteSupplier(id);
  }

}