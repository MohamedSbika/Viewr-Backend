import { patientService } from './patient.service';
import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { createBiologyPatientDto } from '@app/shared';
import { PatientBiologyResponseDto } from '@app/shared';
import { UpdateBiologyPatientDto } from '@app/shared';

@Controller('bio/patient')
export class PatientController {

  constructor(private readonly patientService: patientService) {}

  @Post()
  async createPatient(@Body() createPatientDto: createBiologyPatientDto): Promise<PatientBiologyResponseDto> {
    return this.patientService.create(createPatientDto);
  }

  @Get()
  async getAllPatients(): Promise<PatientBiologyResponseDto[]> {
    return this.patientService.findAll();
  }

  @Get(':id')
  async getPatientById(@Param('id') id: string): Promise<PatientBiologyResponseDto> {
    return this.patientService.findById(id);
  }

  @Put(':id')
  async updatePatient(
    @Param('id') id: string,
    @Body() updatePatientDto: UpdateBiologyPatientDto
  ): Promise<PatientBiologyResponseDto> {
    return this.patientService.updatePatient(id, updatePatientDto);
  }

  @Delete(':id')
  async DeletePatient(@Param('id') id: string): Promise<PatientBiologyResponseDto> {
    return this.patientService.delete(id);
  }

}
