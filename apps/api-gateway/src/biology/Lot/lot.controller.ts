import { LotService } from './lot.service';
import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { CreateBiologyLotDto ,LotBiologyResponseDto ,UpdateLotDto } from '@app/shared';

@Controller('bio/lot')
export class LotController {

  constructor(private readonly LotService: LotService) {}

  @Post()
  async createLot(@Body() createLot: CreateBiologyLotDto): Promise<LotBiologyResponseDto> {
    return this.LotService.create(createLot);
  }

  @Get()
  async getAllLot(): Promise<LotBiologyResponseDto[]> {
    return this.LotService.findAll();
  }

  @Get(':id')
  async getLotById(@Param('id') id: string): Promise<LotBiologyResponseDto> {
    return this.LotService.findById(id);
  }

  @Put(':id')
  async updateLot(
    @Param('id') id: string,
    @Body() updateLot: UpdateLotDto
  ): Promise<LotBiologyResponseDto> {
    return this.LotService.updateLot(id, updateLot);
  }

  @Delete(':id')
  async DeleteLot(@Param('id') id: string): Promise<LotBiologyResponseDto> {
    return this.LotService.deleteLot(id);
  }

}
