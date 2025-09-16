import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DentalAppointmentEntity } from '../entities/dental-appointment.entity';
import { DentalPatientEntity } from '../entities/dental-patient.entity';
import { CreateDentalAppointmentDto } from '@app/shared';
import { UpdateAppointmentDto } from '@app/shared';
import { AppointmentSearchDto } from '@app/shared';
import { AppointmentResponseDto } from '@app/shared';
import { DENTAL_APPOINTMENT_STATUS } from '@app/shared';

@Injectable()
export class AppointmentService {
  private readonly logger = new Logger(AppointmentService.name);

  constructor(
    @InjectRepository(DentalAppointmentEntity)
    private appointmentRepository: Repository<DentalAppointmentEntity>,
    @InjectRepository(DentalPatientEntity)
    private patientRepository: Repository<DentalPatientEntity>,
  ) {}

  async createAppointment(createAppointmentDto: CreateDentalAppointmentDto): Promise<AppointmentResponseDto> {
    try {
      this.logger.log(`Creating appointment: ${createAppointmentDto.appointmentType} for patient ${createAppointmentDto.patientId}`);

      // Check if patient exists
      const patient = await this.patientRepository.findOne({
        where: { id: createAppointmentDto.patientId },
      });

      if (!patient) {
        throw new HttpException('Patient not found', HttpStatus.NOT_FOUND);
      }

      const appointment = this.appointmentRepository.create({
        ...createAppointmentDto,
        patient,
      });

      const savedAppointment = await this.appointmentRepository.save(appointment);
      
      return this.mapEntityToResponse(savedAppointment);
    } catch (error) {
      this.logger.error(`Error creating appointment: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findAllAppointments(): Promise<AppointmentResponseDto[]> {
    try {
      this.logger.log('Fetching all appointments');
      
      const appointments = await this.appointmentRepository.find({
        relations: ['patient'],
        order: { startTime: 'ASC' },
      });
      
      return appointments.map(appointment => this.mapEntityToResponse(appointment));
    } catch (error) {
      this.logger.error(`Error fetching appointments: ${error.message}`, error.stack);
      throw new HttpException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAppointmentById(id: string): Promise<AppointmentResponseDto> {
    try {
      this.logger.log(`Fetching appointment by ID: ${id}`);
      
      const appointment = await this.appointmentRepository.findOne({
        where: { id },
        relations: ['patient'],
      });

      if (!appointment) {
        throw new HttpException('Appointment not found', HttpStatus.NOT_FOUND);
      }
      
      return this.mapEntityToResponse(appointment);
    } catch (error) {
      this.logger.error(`Error fetching appointment ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async updateAppointment(id: string, updateAppointmentDto: UpdateAppointmentDto): Promise<AppointmentResponseDto> {
    try {
      this.logger.log(`Updating appointment: ${id}`);
      
      const existingAppointment = await this.appointmentRepository.findOne({
        where: { id },
        relations: ['patient'],
      });

      if (!existingAppointment) {
        throw new HttpException('Appointment not found', HttpStatus.NOT_FOUND);
      }

      // If patientId is being updated, validate the new patient exists
      if (updateAppointmentDto.patientId && updateAppointmentDto.patientId !== existingAppointment.patient.id) {
        const patient = await this.patientRepository.findOne({
          where: { id: updateAppointmentDto.patientId },
        });

        if (!patient) {
          throw new HttpException('Patient not found', HttpStatus.NOT_FOUND);
        }
        
        existingAppointment.patient = patient;
      }

      // Merge the updates
      const updatedAppointment = await this.appointmentRepository.save({
        ...existingAppointment,
        ...updateAppointmentDto,
      });
      
      return this.mapEntityToResponse(updatedAppointment);
    } catch (error) {
      this.logger.error(`Error updating appointment ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async removeAppointment(id: string): Promise<void> {
    try {
      this.logger.log(`Deleting appointment: ${id}`);
      
      const appointment = await this.appointmentRepository.findOne({
        where: { id },
      });

      if (!appointment) {
        throw new HttpException('Appointment not found', HttpStatus.NOT_FOUND);
      }

      await this.appointmentRepository.remove(appointment);
    } catch (error) {
      this.logger.error(`Error deleting appointment ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findAppointmentsByPatient(patientId: string): Promise<AppointmentResponseDto[]> {
    try {
      this.logger.log(`Fetching appointments for patient: ${patientId}`);
      
      const appointments = await this.appointmentRepository.find({
        where: { patient: { id: patientId } },
        relations: ['patient'],
        order: { startTime: 'ASC' },
      });
      
      return appointments.map(appointment => this.mapEntityToResponse(appointment));
    } catch (error) {
      this.logger.error(`Error fetching appointments for patient ${patientId}: ${error.message}`, error.stack);
      throw new HttpException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAppointmentsByDentist(dentistName: string): Promise<AppointmentResponseDto[]> {
    try {
      this.logger.log(`Fetching appointments for dentist: ${dentistName}`);
      
      const appointments = await this.appointmentRepository.find({
        where: { dentistId: dentistName },
        relations: ['patient'],
        order: { startTime: 'ASC' },
      });
      
      return appointments.map(appointment => this.mapEntityToResponse(appointment));
    } catch (error) {
      this.logger.error(`Error fetching appointments for dentist ${dentistName}: ${error.message}`, error.stack);
      throw new HttpException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAppointmentsByStatus(status: DENTAL_APPOINTMENT_STATUS): Promise<AppointmentResponseDto[]> {
    try {
      this.logger.log(`Fetching appointments with status: ${status}`);
      
      const appointments = await this.appointmentRepository.find({
        where: { status },
        relations: ['patient'],
        order: { startTime: 'ASC' },
      });
      
      return appointments.map(appointment => this.mapEntityToResponse(appointment));
    } catch (error) {
      this.logger.error(`Error fetching appointments with status ${status}: ${error.message}`, error.stack);
      throw new HttpException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAppointmentsByDateRange(startDate: string, endDate: string): Promise<AppointmentResponseDto[]> {
    try {
      this.logger.log(`Fetching appointments between ${startDate} and ${endDate}`);
      
      const appointments = await this.appointmentRepository
        .createQueryBuilder('appointment')
        .leftJoinAndSelect('appointment.patient', 'patient')
        .where('appointment.startTime BETWEEN :startDate AND :endDate', {
          startDate,
          endDate,
        })
        .orderBy('appointment.startTime', 'ASC')
        .getMany();
      
      return appointments.map(appointment => this.mapEntityToResponse(appointment));
    } catch (error) {
      this.logger.error(`Error fetching appointments for date range ${startDate} to ${endDate}: ${error.message}`, error.stack);
      throw new HttpException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async completeAppointment(id: string): Promise<AppointmentResponseDto> {
    try {
      this.logger.log(`Completing appointment: ${id}`);
      
      const appointment = await this.appointmentRepository.findOne({
        where: { id },
        relations: ['patient'],
      });

      if (!appointment) {
        throw new HttpException('Appointment not found', HttpStatus.NOT_FOUND);
      }

      appointment.status = DENTAL_APPOINTMENT_STATUS.COMPLETED;
      const updatedAppointment = await this.appointmentRepository.save(appointment);
      
      return this.mapEntityToResponse(updatedAppointment);
    } catch (error) {
      this.logger.error(`Error completing appointment ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async searchAppointments(searchDto: AppointmentSearchDto): Promise<AppointmentResponseDto[]> {
    try {
      this.logger.log(`Searching appointments with criteria: ${JSON.stringify(searchDto)}`);
      
      const queryBuilder = this.appointmentRepository.createQueryBuilder('appointment')
        .leftJoinAndSelect('appointment.patient', 'patient');
      
      if (searchDto.patientId) {
        queryBuilder.andWhere('appointment.patientId = :patientId', { 
          patientId: searchDto.patientId 
        });
      }
      
      if (searchDto.dentistId) {
        queryBuilder.andWhere('appointment.dentistId = :dentistId', { 
          dentistId: searchDto.dentistId 
        });
      }
      
      if (searchDto.appointmentType) {
        queryBuilder.andWhere('appointment.appointmentType = :appointmentType', { 
          appointmentType: searchDto.appointmentType 
        });
      }
      
      if (searchDto.status) {
        queryBuilder.andWhere('appointment.status = :status', { 
          status: searchDto.status 
        });
      }
      
      if (searchDto.startDate && searchDto.endDate) {
        queryBuilder.andWhere('appointment.startTime BETWEEN :startDate AND :endDate', {
          startDate: searchDto.startDate,
          endDate: searchDto.endDate,
        });
      }
      
      const appointments = await queryBuilder
        .orderBy('appointment.startTime', 'ASC')
        .getMany();
      
      return appointments.map(appointment => this.mapEntityToResponse(appointment));
    } catch (error) {
      this.logger.error(`Error searching appointments: ${error.message}`, error.stack);
      throw new HttpException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private mapEntityToResponse(appointment: DentalAppointmentEntity): AppointmentResponseDto {
    return {
      id: appointment.id,
      startTime: appointment.startTime,
      endTime: appointment.endTime,
      status: appointment.status,
      appointmentType: appointment.appointmentType,
      notes: appointment.notes,
      treatmentPlan: appointment.treatmentPlan,
      diagnosis: appointment.diagnosis,
      proceduresConducted: appointment.proceduresConducted,
      totalAmount: appointment.totalAmount,
      paidAmount: appointment.paidAmount,
      patientId: appointment.patientId,
      dentistId: appointment.dentistId,
      roomNumber: appointment.roomNumber,
      followUpRequired: appointment.followUpRequired,
      followUpDate: appointment.followUpDate,
      prescriptions: appointment.prescriptions,
      xrayUrls: appointment.xrayUrls,
      dentalPhotos: appointment.dentalPhotos,
      createdAt: appointment.createdAt,
      updatedAt: appointment.updatedAt,
    };
  }
}
