import { Injectable, Logger, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { Request } from 'express';
import { CreatePatientDto } from '@app/shared';
import { UpdatePatientDto } from '@app/shared';
import { UpdateDentalChartDto } from '@app/shared';
import { PatientDentalResponseDto } from '@app/shared';
import { RabbitMQService } from '@app/shared';

@Injectable()
export class PatientService {
  private readonly logger = new Logger(PatientService.name);

  constructor(
    private readonly rabbitMQService: RabbitMQService,
  ) {
    this.logger.log('Patient Service initialized');
  }

  /**
   * Create a new patient
   * @param {CreatePatientDto} createPatientDto - Patient data
   * @param {Request} req - Express request object containing headers
   * @returns {Promise<PatientDentalResponseDto>} The created patient
   */
  async createPatient(createPatientDto: CreatePatientDto, req: Request): Promise<PatientDentalResponseDto> {
    try {
      this.logger.log(`Creating patient: ${createPatientDto.firstName} ${createPatientDto.lastName}`);
      
      const targetQueue = (req as any).targetQueue;
      this.logger.log(`Using queue: ${targetQueue} for patient.create`);
      
      return await this.rabbitMQService.sendMessage(targetQueue, 'patient.create', createPatientDto);
    } catch (error) {
      this.logger.error(`Error creating patient: ${error.message}`, error.stack);
      throw new HttpException(error.response || {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Get all patients
   * @param {Request} req - Express request object containing headers
   * @returns {Promise<PatientResponseDto[]>} List of all patients
   */
  async getAllPatients(req: Request): Promise<PatientDentalResponseDto[]> {
    try {
      this.logger.log('Getting all patients');
      
      const targetQueue = (req as any).targetQueue;
      this.logger.log(`Using queue: ${targetQueue} for patient.findAll`);
      
      return await this.rabbitMQService.sendMessage(targetQueue, 'patient.findAll', {});
    } catch (error) {
      this.logger.error(`Error getting all patients: ${error.message}`, error.stack);
      throw new HttpException(error.response || {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Get patient by ID
   * @param {string} id - Patient ID
   * @param {Request} req - Express request object containing headers
   * @returns {Promise<PatientResponseDto>} The patient
   */
  async getPatientById(id: string, req: Request): Promise<PatientDentalResponseDto> {
    try {
      this.logger.log(`Getting patient with ID: ${id}`);
      
      const targetQueue = (req as any).targetQueue;
      this.logger.log(`Using queue: ${targetQueue} for patient.findOne`);
      
      return await this.rabbitMQService.sendMessage(targetQueue, 'patient.findOne', { id });
    } catch (error) {
      this.logger.error(`Error getting patient: ${error.message}`, error.stack);
      throw new HttpException(error.response || {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Update patient
   * @param {string} id - Patient ID
   * @param {UpdatePatientDto} updatePatientDto - Updated data
   * @param {Request} req - Express request object containing headers
   * @returns {Promise<PatientResponseDto>} Updated patient
   */
  async updatePatient(id: string, updatePatientDto: UpdatePatientDto, req: Request): Promise<PatientDentalResponseDto> {
    try {
      this.logger.log(`Updating patient with ID: ${id}`);
      
      const targetQueue = (req as any).targetQueue;
      this.logger.log(`Using queue: ${targetQueue} for patient.update`);
      
      return await this.rabbitMQService.sendMessage(targetQueue, 'patient.update', { id, updatePatientDto });
    } catch (error) {
      this.logger.error(`Error updating patient: ${error.message}`, error.stack);
      throw new HttpException(error.response || {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Delete patient
   * @param {string} id - Patient ID
   * @param {Request} req - Express request object containing headers
   * @returns {Promise<void>}
   */
  async deletePatient(id: string, req: Request): Promise<void> {
    try {
      this.logger.log(`Deleting patient with ID: ${id}`);
      
      const targetQueue = (req as any).targetQueue;
      this.logger.log(`Using queue: ${targetQueue} for patient.remove`);
      
      return await this.rabbitMQService.sendMessage(targetQueue, 'patient.remove', { id });
    } catch (error) {
      this.logger.error(`Error deleting patient: ${error.message}`, error.stack);
      throw new HttpException(error.response || {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Update patient's dental chart
   * @param {string} id - Patient ID
   * @param {UpdateDentalChartDto} updateDentalChartDto - Dental chart update data
   * @param {Request} req - Express request object containing headers
   * @returns {Promise<PatientResponseDto>} Updated patient with new dental chart
   */
  async updateDentalChart(id: string, updateDentalChartDto: UpdateDentalChartDto, req: Request): Promise<PatientDentalResponseDto> {
    try {
      this.logger.log(`Updating dental chart for patient with ID: ${id}`);
      
      const targetQueue = (req as any).targetQueue;
      this.logger.log(`Using queue: ${targetQueue} for patient.updateDentalChart`);
      
      return await this.rabbitMQService.sendMessage(targetQueue, 'patient.updateDentalChart', { id, updateDentalChartDto });
    } catch (error) {
      this.logger.error(`Error updating dental chart: ${error.message}`, error.stack);
      throw new HttpException(error.response || {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Get patient's dental chart
   * @param {string} id - Patient ID
   * @param {Request} req - Express request object containing headers
   * @returns {Promise<Record<string, any>>} Patient's dental chart
   */
  async getDentalChart(id: string, req: Request): Promise<Record<string, any>> {
    try {
      this.logger.log(`Getting dental chart for patient with ID: ${id}`);
      
      const targetQueue = (req as any).targetQueue;
      this.logger.log(`Using queue: ${targetQueue} for patient.getDentalChart`);
      
      return await this.rabbitMQService.sendMessage(targetQueue, 'patient.getDentalChart', { id });
    } catch (error) {
      this.logger.error(`Error getting dental chart: ${error.message}`, error.stack);
      throw new HttpException(error.response || {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
