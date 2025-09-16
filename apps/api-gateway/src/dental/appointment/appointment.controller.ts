import { Controller, Get, Post, Body, Param, Put, Delete, Logger, Inject, Req, Query } from '@nestjs/common';
import type { Request } from 'express';
import { AppointmentService } from './appointment.service';
import { CreateDentalAppointmentDto } from '@app/shared';
import { UpdateAppointmentDto } from '@app/shared';
import { AppointmentResponseDto } from '@app/shared';
import { FileLoggerService } from '@app/shared';

@Controller('dentist/appointments')
export class AppointmentController {
  private readonly logger = new Logger(AppointmentController.name);

  constructor(
    private readonly appointmentService: AppointmentService,
    @Inject('FileLogger') private readonly fileLogger: FileLoggerService
  ) {
    this.logger.log('Appointment controller initialized');
  }

  /**
   * Creates a new appointment
   * @param {CreateAppointmentDto} createAppointmentDto - The appointment data
   * @returns {Promise<AppointmentResponseDto>} Created appointment information
   */
  @Post()
  async createAppointment(@Body() createAppointmentDto: CreateDentalAppointmentDto, @Req() req: Request): Promise<AppointmentResponseDto> {
    const logMessage = `Creating appointment for patient: ${createAppointmentDto.patientId} with dentist: ${createAppointmentDto.dentistId}`;
    this.fileLogger.log(logMessage, 'appointment-create', AppointmentController.name);
    return this.appointmentService.createAppointment(createAppointmentDto, req);
  }

  /**
   * Gets all appointments
   * @returns {Promise<AppointmentResponseDto[]>} List of all appointments
   */
  @Get()
  async getAllAppointments(@Req() req: Request): Promise<AppointmentResponseDto[]> {
    const logMessage = 'Getting all appointments';
    this.fileLogger.log(logMessage, 'appointment-findAll', AppointmentController.name);
    return this.appointmentService.getAllAppointments(req);
  }

  /**
   * Gets a specific appointment by ID
   * @param {string} id - Appointment ID
   * @returns {Promise<AppointmentResponseDto>} The appointment details
   */
  @Get(':id')
  async getAppointmentById(@Param('id') id: string, @Req() req: Request): Promise<AppointmentResponseDto> {
    const logMessage = `Getting appointment with ID: ${id}`;
    this.fileLogger.log(logMessage, 'appointment-findOne', AppointmentController.name);
    return this.appointmentService.getAppointmentById(id, req);
  }

  /**
   * Updates an appointment
   * @param {string} id - Appointment ID
   * @param {UpdateAppointmentDto} updateAppointmentDto - Updated data
   * @returns {Promise<AppointmentResponseDto>} Updated appointment
   */
  @Put(':id')
  async updateAppointment(
    @Param('id') id: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
    @Req() req: Request
  ): Promise<AppointmentResponseDto> {
    const logMessage = `Updating appointment with ID: ${id}`;
    this.fileLogger.log(logMessage, 'appointment-update', AppointmentController.name);
    return this.appointmentService.updateAppointment(id, updateAppointmentDto, req);
  }

  /**
   * Deletes an appointment
   * @param {string} id - Appointment ID
   * @returns {Promise<void>}
   */
  @Delete(':id')
  async deleteAppointment(@Param('id') id: string, @Req() req: Request): Promise<void> {
    const logMessage = `Deleting appointment with ID: ${id}`;
    this.fileLogger.log(logMessage, 'appointment-remove', AppointmentController.name);
    return this.appointmentService.deleteAppointment(id, req);
  }

  /**
   * Gets appointments by patient ID
   * @param {string} patientId - Patient ID
   * @returns {Promise<AppointmentResponseDto[]>} Patient's appointments
   */
  @Get('patient/:patientId')
  async getAppointmentsByPatient(@Param('patientId') patientId: string, @Req() req: Request): Promise<AppointmentResponseDto[]> {
    const logMessage = `Getting appointments for patient with ID: ${patientId}`;
    this.fileLogger.log(logMessage, 'appointment-findByPatient', AppointmentController.name);
    return this.appointmentService.getAppointmentsByPatient(patientId, req);
  }

  /**
   * Gets appointments by dentist ID
   * @param {string} dentistId - Dentist ID
   * @returns {Promise<AppointmentResponseDto[]>} Dentist's appointments
   */
  @Get('dentist/:dentistId')
  async getAppointmentsByDentist(@Param('dentistId') dentistId: string, @Req() req: Request): Promise<AppointmentResponseDto[]> {
    const logMessage = `Getting appointments for dentist with ID: ${dentistId}`;
    this.fileLogger.log(logMessage, 'appointment-findByDentist', AppointmentController.name);
    return this.appointmentService.getAppointmentsByDentist(dentistId, req);
  }

  /**
   * Gets appointments by status
   * @param {string} status - Appointment status
   * @returns {Promise<AppointmentResponseDto[]>} Appointments with specified status
   */
  @Get('status/:status')
  async getAppointmentsByStatus(@Param('status') status: string, @Req() req: Request): Promise<AppointmentResponseDto[]> {
    const logMessage = `Getting appointments with status: ${status}`;
    this.fileLogger.log(logMessage, 'appointment-findByStatus', AppointmentController.name);
    return this.appointmentService.getAppointmentsByStatus(status, req);
  }

  /**
   * Gets appointments by date range
   * @param {string} startDate - Start date (ISO string)
   * @param {string} endDate - End date (ISO string)
   * @returns {Promise<AppointmentResponseDto[]>} Appointments in date range
   */
  @Get('date-range')
  async getAppointmentsByDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Req() req: Request
  ): Promise<AppointmentResponseDto[]> {
    const logMessage = `Getting appointments between ${startDate} and ${endDate}`;
    this.fileLogger.log(logMessage, 'appointment-findByDateRange', AppointmentController.name);
    return this.appointmentService.getAppointmentsByDateRange(new Date(startDate), new Date(endDate), req);
  }

  /**
   * Completes an appointment (changes status to completed)
   * @param {string} id - Appointment ID
   * @returns {Promise<AppointmentResponseDto>} Completed appointment
   */
  @Post(':id/complete')
  async completeAppointment(@Param('id') id: string, @Req() req: Request): Promise<AppointmentResponseDto> {
    const logMessage = `Completing appointment with ID: ${id}`;
    this.fileLogger.log(logMessage, 'appointment-complete', AppointmentController.name);
    return this.appointmentService.completeAppointment(id, req);
  }
}
