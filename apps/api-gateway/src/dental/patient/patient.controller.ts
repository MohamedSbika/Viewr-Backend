import { Controller, Get, Post, Body, Param, Put, Delete, Logger, Inject, Req, Patch } from '@nestjs/common';
import type { Request } from 'express';
import { PatientService } from './patient.service';
import { CreatePatientDto } from '@app/shared';
import { UpdatePatientDto } from '@app/shared';
import { UpdateDentalChartDto } from '@app/shared';
import { PatientDentalResponseDto } from '@app/shared';
import { FileLoggerService } from '@app/shared';

@Controller('dentist/patients')
export class PatientController {
  private readonly logger = new Logger(PatientController.name);

  constructor(
    private readonly patientService: PatientService,
    @Inject('FileLogger') private readonly fileLogger: FileLoggerService
  ) {
    this.logger.log('Patient controller initialized');
  }

  /**
   * Creates a new patient
   * @param {CreatePatientDto} createPatientDto - The patient data
   * @returns {Promise<PatientDentalResponseDto>} Created patient information
   */
  @Post()
  async createPatient(@Body() createPatientDto: CreatePatientDto, @Req() req: Request): Promise<PatientDentalResponseDto> {
    const logMessage = `Creating patient: ${createPatientDto.firstName} ${createPatientDto.lastName}`;
    this.fileLogger.log(logMessage, 'patient-create', PatientController.name);
    return this.patientService.createPatient(createPatientDto, req);
  }

  /**
   * Gets all patients
   * @returns {Promise<PatientResponseDto[]>} List of all patients
   */
  @Get()
  async getAllPatients(@Req() req: Request): Promise<PatientDentalResponseDto[]> {
    const logMessage = 'Getting all patients';
    this.fileLogger.log(logMessage, 'patient-findAll', PatientController.name);
    return this.patientService.getAllPatients(req);
  }

  /**
   * Gets a specific patient by ID
   * @param {string} id - Patient ID
   * @returns {Promise<PatientResponseDto>} The patient details
   */
  @Get(':id')
  async getPatientById(@Param('id') id: string, @Req() req: Request): Promise<PatientDentalResponseDto> {
    const logMessage = `Getting patient with ID: ${id}`;
    this.fileLogger.log(logMessage, 'patient-findOne', PatientController.name);
    return this.patientService.getPatientById(id, req);
  }

  /**
   * Updates a patient
   * @param {string} id - Patient ID
   * @param {UpdatePatientDto} updatePatientDto - Updated data
   * @returns {Promise<PatientResponseDto>} Updated patient
   */
  @Put(':id')
  async updatePatient(
    @Param('id') id: string,
    @Body() updatePatientDto: UpdatePatientDto,
    @Req() req: Request
  ): Promise<PatientDentalResponseDto> {
    const logMessage = `Updating patient with ID: ${id}`;
    this.fileLogger.log(logMessage, 'patient-update', PatientController.name);
    return this.patientService.updatePatient(id, updatePatientDto, req);
  }

  /**
   * Deletes a patient
   * @param {string} id - Patient ID
   * @returns {Promise<void>}
   */
  @Delete(':id')
  async deletePatient(@Param('id') id: string, @Req() req: Request): Promise<void> {
    const logMessage = `Deleting patient with ID: ${id}`;
    this.fileLogger.log(logMessage, 'patient-remove', PatientController.name);
    return this.patientService.deletePatient(id, req);
  }

  /**
   * Updates a patient's dental chart
   * @param {string} id - Patient ID
   * @param {UpdateDentalChartDto} updateDentalChartDto - Dental chart JSON data
   * @returns {Promise<PatientResponseDto>} Updated patient with new dental chart
   */
  @Patch(':id/dental-chart')
  async updateDentalChart(
    @Param('id') id: string,
    @Body() updateDentalChartDto: UpdateDentalChartDto,
    @Req() req: Request
  ): Promise<PatientDentalResponseDto> {
    const logMessage = `Updating dental chart for patient with ID: ${id}`;
    this.fileLogger.log(logMessage, 'patient-updateDentalChart', PatientController.name);
    return this.patientService.updateDentalChart(id, updateDentalChartDto, req);
  }

  /**
   * Gets a patient's dental chart
   * @param {string} id - Patient ID
   * @returns {Promise<Record<string, any>>} Patient's dental chart
   */
  @Get(':id/dental-chart')
  async getDentalChart(@Param('id') id: string, @Req() req: Request): Promise<Record<string, any>> {
    const logMessage = `Getting dental chart for patient with ID: ${id}`;
    this.fileLogger.log(logMessage, 'patient-getDentalChart', PatientController.name);
    return this.patientService.getDentalChart(id, req);
  }
}
