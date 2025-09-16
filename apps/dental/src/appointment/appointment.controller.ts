import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AppointmentService } from './appointment.service';
import { CreateDentalAppointmentDto } from '@app/shared';
import { UpdateAppointmentDto } from '@app/shared';
import { AppointmentSearchDto } from '@app/shared';
import { AppointmentResponseDto } from '@app/shared';
import { DENTAL_APPOINTMENT_STATUS } from '@app/shared';

@Controller()
export class AppointmentController {
  private readonly logger = new Logger(AppointmentController.name);

  constructor(private readonly appointmentService: AppointmentService) {}

  @MessagePattern('appointment.create')
  async createAppointment(@Payload() createAppointmentDto: CreateDentalAppointmentDto): Promise<AppointmentResponseDto> {
    this.logger.log('Creating appointment');
    return this.appointmentService.createAppointment(createAppointmentDto);
  }

  @MessagePattern('appointment.findAll')
  async findAllAppointments(): Promise<AppointmentResponseDto[]> {
    this.logger.log('Finding all appointments');
    return this.appointmentService.findAllAppointments();
  }

  @MessagePattern('appointment.findById')
  async findAppointmentById(@Payload() payload: { id: string }): Promise<AppointmentResponseDto> {
    this.logger.log(`Finding appointment by ID: ${payload.id}`);
    return this.appointmentService.findAppointmentById(payload.id);
  }

  @MessagePattern('appointment.update')
  async updateAppointment(@Payload() payload: { id: string; data: UpdateAppointmentDto }): Promise<AppointmentResponseDto> {
    this.logger.log(`Updating appointment: ${payload.id}`);
    return this.appointmentService.updateAppointment(payload.id, payload.data);
  }

  @MessagePattern('appointment.remove')
  async removeAppointment(@Payload() payload: { id: string }): Promise<void> {
    this.logger.log(`Removing appointment: ${payload.id}`);
    return this.appointmentService.removeAppointment(payload.id);
  }

  @MessagePattern('appointment.findByPatient')
  async findAppointmentsByPatient(@Payload() payload: { patientId: string }): Promise<AppointmentResponseDto[]> {
    this.logger.log(`Finding appointments for patient: ${payload.patientId}`);
    return this.appointmentService.findAppointmentsByPatient(payload.patientId);
  }

  @MessagePattern('appointment.findByDentist')
  async findAppointmentsByDentist(@Payload() payload: { dentistName: string }): Promise<AppointmentResponseDto[]> {
    this.logger.log(`Finding appointments for dentist: ${payload.dentistName}`);
    return this.appointmentService.findAppointmentsByDentist(payload.dentistName);
  }

  @MessagePattern('appointment.findByStatus')
  async findAppointmentsByStatus(@Payload() payload: { status: DENTAL_APPOINTMENT_STATUS }): Promise<AppointmentResponseDto[]> {
    this.logger.log(`Finding appointments with status: ${payload.status}`);
    return this.appointmentService.findAppointmentsByStatus(payload.status);
  }

  @MessagePattern('appointment.findByDateRange')
  async findAppointmentsByDateRange(@Payload() payload: { startDate: string; endDate: string }): Promise<AppointmentResponseDto[]> {
    this.logger.log(`Finding appointments between ${payload.startDate} and ${payload.endDate}`);
    return this.appointmentService.findAppointmentsByDateRange(payload.startDate, payload.endDate);
  }

  @MessagePattern('appointment.complete')
  async completeAppointment(@Payload() payload: { id: string }): Promise<AppointmentResponseDto> {
    this.logger.log(`Completing appointment: ${payload.id}`);
    return this.appointmentService.completeAppointment(payload.id);
  }

  @MessagePattern('appointment.search')
  async searchAppointments(@Payload() searchDto: AppointmentSearchDto): Promise<AppointmentResponseDto[]> {
    this.logger.log('Searching appointments');
    return this.appointmentService.searchAppointments(searchDto);
  }
}
