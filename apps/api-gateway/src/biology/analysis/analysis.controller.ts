import { Controller, Get, Post, Body, Param, Put, Delete, NotFoundException } from '@nestjs/common';
import { AnalysisService } from './analysis.service';
import { CreateAnalysisDto } from '@app/shared';
import { AnalysisResponseDto } from '@app/shared';
import { UpdateAnalysisDto } from '@app/shared';

@Controller('bio/analysis')
export class AnalysisController {
  constructor(private readonly analysisService: AnalysisService) {}

  @Post()
  async createAnalysis(
    @Body() createAnalysisDto: CreateAnalysisDto
  ): Promise<AnalysisResponseDto> {
    return await this.analysisService.create(createAnalysisDto);
  }

  @Get()
  async getAlAnalysis(): Promise<AnalysisResponseDto[]> {
    return await this.analysisService.findAll();
  }

  @Get(':id')
  async getAnalysisById(@Param('id') id: string): Promise<AnalysisResponseDto> {
    const analysis = await this.analysisService.findById(id);
    return analysis;
  }

  @Put(":id")
  async updateAnalysis(
    @Param('id') id: string,
    @Body() updateAnalysisDto: UpdateAnalysisDto
  ): Promise<AnalysisResponseDto> {
    const analysis = await this.analysisService.updateAnalysis(id, updateAnalysisDto);
    return analysis;
  }

  @Delete(':id')
  async DeleteAnalysis(@Param('id') id: string): Promise<AnalysisResponseDto> {
    const analysis = await this.analysisService.delete(id);
    return analysis;
  }
}
