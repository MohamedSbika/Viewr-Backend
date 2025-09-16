import { Injectable, Logger, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { Request } from 'express';
import { CreateDentalAppointmentDto } from '@app/shared';
import { UpdateAppointmentDto } from '@app/shared';
import { AppointmentResponseDto } from '@app/shared';
import { RabbitMQService } from '@app/shared';

@Injectable()
export class AppointmentService {
  private readonly logger = new Logger(AppointmentService.name);

  constructor(
    private readonly rabbitMQService: RabbitMQService,
  ) {
    this.logger.log('Appointment Service initialized');
  }

  /**
   * Create a new appointment
   * @param {CreateAppointmentDto} createAppointmentDto - Appointment data
   * @param {Request} req - Express request object containing headers
   * @returns {Promise<AppointmentResponseDto>} The created appointment
   */
  async createAppointment(createAppointmentDto: CreateDentalAppointmentDto, req: Request): Promise<AppointmentResponseDto> {
    try {
      this.logger.log(`Creating appointment for patient: ${createAppointmentDto.patientId} with dentist: ${createAppointmentDto.dentistId}`);
      
      const targetQueue = (req as any).targetQueue;
      this.logger.log(`Using queue: ${targetQueue} for appointment.create`);
      
      return await this.rabbitMQService.sendMessage(targetQueue, 'appointment.create', createAppointmentDto);
    } catch (error) {
      this.logger.error(`Error creating appointment: ${error.message}`, error.stack);
      throw new HttpException(error.response || {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Get all appointments
   * @param {Request} req - Express request object containing headers
   * @returns {Promise<AppointmentResponseDto[]>} List of all appointments
   */
  async getAllAppointments(req: Request): Promise<AppointmentResponseDto[]> {
    try {
      this.logger.log('Getting all appointments');
      
      const targetQueue = (req as any).targetQueue;
      this.logger.log(`Using queue: ${targetQueue} for appointment.findAll`);
      
      return await this.rabbitMQService.sendMessage(targetQueue, 'appointment.findAll', {});
    } catch (error) {
      this.logger.error(`Error getting all appointments: ${error.message}`, error.stack);
      throw new HttpException(error.response || {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Get appointment by ID
   * @param {string} id - Appointment ID
   * @param {Request} req - Express request object containing headers
   * @returns {Promise<AppointmentResponseDto>} The appointment
   */
  async getAppointmentById(id: string, req: Request): Promise<AppointmentResponseDto> {
    try {
      this.logger.log(`Getting appointment with ID: ${id}`);
      
      const targetQueue = (req as any).targetQueue;
      this.logger.log(`Using queue: ${targetQueue} for appointment.findOne`);
      
      return await this.rabbitMQService.sendMessage(targetQueue, 'appointment.findOne', { id });
    } catch (error) {
      this.logger.error(`Error getting appointment: ${error.message}`, error.stack);
      throw new HttpException(error.response || {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Update appointment
   * @param {string} id - Appointment ID
   * @param {UpdateAppointmentDto} updateAppointmentDto - Updated data
   * @param {Request} req - Express request object containing headers
   * @returns {Promise<AppointmentResponseDto>} Updated appointment
   */
  async updateAppointment(id: string, updateAppointmentDto: UpdateAppointmentDto, req: Request): Promise<AppointmentResponseDto> {
    try {
      this.logger.log(`Updating appointment with ID: ${id}`);
      
      const targetQueue = (req as any).targetQueue;
      this.logger.log(`Using queue: ${targetQueue} for appointment.update`);
      
      return await this.rabbitMQService.sendMessage(targetQueue, 'appointment.update', { id, updateAppointmentDto });
    } catch (error) {
      this.logger.error(`Error updating appointment: ${error.message}`, error.stack);
      throw new HttpException(error.response || {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Delete appointment
   * @param {string} id - Appointment ID
   * @param {Request} req - Express request object containing headers
   * @returns {Promise<void>}
   */
  async deleteAppointment(id: string, req: Request): Promise<void> {
    try {
      this.logger.log(`Deleting appointment with ID: ${id}`);
      
      const targetQueue = (req as any).targetQueue;
      this.logger.log(`Using queue: ${targetQueue} for appointment.remove`);
      
      return await this.rabbitMQService.sendMessage(targetQueue, 'appointment.remove', { id });
    } catch (error) {
      this.logger.error(`Error deleting appointment: ${error.message}`, error.stack);
      throw new HttpException(error.response || {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Get appointments by patient ID
   * @param {string} patientId - Patient ID
   * @param {Request} req - Express request object containing headers
   * @returns {Promise<AppointmentResponseDto[]>} Patient's appointments
   */
  async getAppointmentsByPatient(patientId: string, req: Request): Promise<AppointmentResponseDto[]> {
    try {
      this.logger.log(`Getting appointments for patient with ID: ${patientId}`);
      
      const targetQueue = (req as any).targetQueue;
      this.logger.log(`Using queue: ${targetQueue} for appointment.findByPatient`);
      
      return await this.rabbitMQService.sendMessage(targetQueue, 'appointment.findByPatient', { patientId });
    } catch (error) {
      this.logger.error(`Error getting patient appointments: ${error.message}`, error.stack);
      throw new HttpException(error.response || {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Get appointments by dentist ID
   * @param {string} dentistId - Dentist ID
   * @param {Request} req - Express request object containing headers
   * @returns {Promise<AppointmentResponseDto[]>} Dentist's appointments
   */
  async getAppointmentsByDentist(dentistId: string, req: Request): Promise<AppointmentResponseDto[]> {
    try {
      this.logger.log(`Getting appointments for dentist with ID: ${dentistId}`);
      
      const targetQueue = (req as any).targetQueue;
      this.logger.log(`Using queue: ${targetQueue} for appointment.findByDentist`);
      
      return await this.rabbitMQService.sendMessage(targetQueue, 'appointment.findByDentist', { dentistId });
    } catch (error) {
      this.logger.error(`Error getting dentist appointments: ${error.message}`, error.stack);
      throw new HttpException(error.response || {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Get appointments by status
   * @param {string} status - Appointment status
   * @param {Request} req - Express request object containing headers
   * @returns {Promise<AppointmentResponseDto[]>} Appointments with specified status
   */
  async getAppointmentsByStatus(status: string, req: Request): Promise<AppointmentResponseDto[]> {
    try {
      this.logger.log(`Getting appointments with status: ${status}`);
      
      const targetQueue = (req as any).targetQueue;
      this.logger.log(`Using queue: ${targetQueue} for appointment.findByStatus`);
      
      return await this.rabbitMQService.sendMessage(targetQueue, 'appointment.findByStatus', { status });
    } catch (error) {
      this.logger.error(`Error getting appointments by status: ${error.message}`, error.stack);
      throw new HttpException(error.response || {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Get appointments by date range
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @param {Request} req - Express request object containing headers
   * @returns {Promise<AppointmentResponseDto[]>} Appointments in date range
   */
  async getAppointmentsByDateRange(startDate: Date, endDate: Date, req: Request): Promise<AppointmentResponseDto[]> {
    try {
      this.logger.log(`Getting appointments between ${startDate} and ${endDate}`);
      
      const targetQueue = (req as any).targetQueue;
      this.logger.log(`Using queue: ${targetQueue} for appointment.findByDateRange`);
      
      return await this.rabbitMQService.sendMessage(targetQueue, 'appointment.findByDateRange', { startDate, endDate });
    } catch (error) {
      this.logger.error(`Error getting appointments by date range: ${error.message}`, error.stack);
      throw new HttpException(error.response || {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Complete appointment (change status to completed)
   * @param {string} id - Appointment ID
   * @param {Request} req - Express request object containing headers
   * @returns {Promise<AppointmentResponseDto>} Completed appointment
   */
  async completeAppointment(id: string, req: Request): Promise<AppointmentResponseDto> {
    try {
      this.logger.log(`Completing appointment with ID: ${id}`);
      
      const targetQueue = (req as any).targetQueue;
      this.logger.log(`Using queue: ${targetQueue} for appointment.complete`);
      
      return await this.rabbitMQService.sendMessage(targetQueue, 'appointment.complete', { id });
    } catch (error) {
      this.logger.error(`Error completing appointment: ${error.message}`, error.stack);
      throw new HttpException(error.response || {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
