import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Between } from 'typeorm';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { UpdateDentalChartDto } from './dto/update-dental-chart.dto';
import { PatientSearchDto } from './dto/patient-search.dto';
import { PatientResponseDto } from './dto/patient-response.dto';
import { DentalPatientEntity } from '../entities/dental-patient.entity';
import { INSURANCE } from '@app/shared';

@Injectable()
export class PatientService {
  private readonly logger = new Logger(PatientService.name);

  constructor(
    @InjectRepository(DentalPatientEntity)
    private readonly patientRepository: Repository<DentalPatientEntity>,
  ) {}

  async createPatient(createPatientDto: CreatePatientDto): Promise<PatientResponseDto> {
    try {
      this.logger.log(`Creating patient: ${createPatientDto.firstName} ${createPatientDto.lastName}`);
      
      // Create patient entity
      const patient = this.patientRepository.create({
        ...createPatientDto,
        insuranceType: createPatientDto.insuranceType || INSURANCE.CNAM,
      });

      // Save to database
      const savedPatient = await this.patientRepository.save(patient);
      
      return this.mapEntityToResponse(savedPatient);
    } catch (error) {
      this.logger.error(`Error creating patient: ${error.message}`, error.stack);
      
      if (error.code === '23505') { // PostgreSQL unique violation
        throw new HttpException('Patient with this CIN already exists', HttpStatus.CONFLICT);
      }
      
      throw new HttpException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAllPatients(): Promise<PatientResponseDto[]> {
    try {
      this.logger.log('Fetching all patients');
      
      const patients = await this.patientRepository.find({
        relations: ['appointments'],
        order: { createdAt: 'DESC' },
      });
      
      return patients.map(patient => this.mapEntityToResponse(patient));
    } catch (error) {
      this.logger.error(`Error fetching patients: ${error.message}`, error.stack);
      throw new HttpException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findPatientById(id: string): Promise<PatientResponseDto> {
    try {
      this.logger.log(`Fetching patient by ID: ${id}`);
      
      const patient = await this.patientRepository.findOne({
        where: { id },
        relations: ['appointments'],
      });

      if (!patient) {
        throw new HttpException('Patient not found', HttpStatus.NOT_FOUND);
      }
      
      return this.mapEntityToResponse(patient);
    } catch (error) {
      this.logger.error(`Error fetching patient ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async updatePatient(id: string, updatePatientDto: UpdatePatientDto): Promise<PatientResponseDto> {
    try {
      this.logger.log(`Updating patient: ${id}`);
      
      const existingPatient = await this.patientRepository.findOne({
        where: { id },
      });

      if (!existingPatient) {
        throw new HttpException('Patient not found', HttpStatus.NOT_FOUND);
      }

      // Merge the updates
      const updatedPatient = await this.patientRepository.save({
        ...existingPatient,
        ...updatePatientDto,
      });
      
      return this.mapEntityToResponse(updatedPatient);
    } catch (error) {
      this.logger.error(`Error updating patient ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async removePatient(id: string): Promise<void> {
    try {
      this.logger.log(`Deleting patient: ${id}`);
      
      const patient = await this.patientRepository.findOne({
        where: { id },
      });

      if (!patient) {
        throw new HttpException('Patient not found', HttpStatus.NOT_FOUND);
      }

      await this.patientRepository.remove(patient);
    } catch (error) {
      this.logger.error(`Error deleting patient ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async updateDentalChart(id: string, updateDentalChartDto: UpdateDentalChartDto): Promise<PatientResponseDto> {
    try {
      this.logger.log(`Updating dental chart for patient: ${id}`);
      
      const existingPatient = await this.patientRepository.findOne({
        where: { id },
      });

      if (!existingPatient) {
        throw new HttpException('Patient not found', HttpStatus.NOT_FOUND);
      }

      // Update dental chart
      const updatedPatient = await this.patientRepository.save({
        ...existingPatient,
        dentalChart: updateDentalChartDto.dentalChart,
      });
      
      return this.mapEntityToResponse(updatedPatient);
    } catch (error) {
      this.logger.error(`Error updating dental chart for patient ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async searchPatients(searchDto: PatientSearchDto): Promise<PatientResponseDto[]> {
    try {
      this.logger.log(`Searching patients with criteria: ${JSON.stringify(searchDto)}`);
      
      const queryBuilder = this.patientRepository.createQueryBuilder('patient');
      
      if (searchDto.firstName) {
        queryBuilder.andWhere('patient.firstName ILIKE :firstName', { 
          firstName: `%${searchDto.firstName}%` 
        });
      }
      
      if (searchDto.lastName) {
        queryBuilder.andWhere('patient.lastName ILIKE :lastName', { 
          lastName: `%${searchDto.lastName}%` 
        });
      }
      
      if (searchDto.cin) {
        queryBuilder.andWhere('patient.cin = :cin', { cin: searchDto.cin });
      }
      
      if (searchDto.phoneNumber) {
        queryBuilder.andWhere('patient.phoneNumber ILIKE :phoneNumber', { 
          phoneNumber: `%${searchDto.phoneNumber}%` 
        });
      }
      
      if (searchDto.email) {
        queryBuilder.andWhere('patient.email ILIKE :email', { 
          email: `%${searchDto.email}%` 
        });
      }
      
      if (searchDto.dateOfBirthFrom && searchDto.dateOfBirthTo) {
        queryBuilder.andWhere('patient.dateOfBirth BETWEEN :startDate AND :endDate', {
          startDate: searchDto.dateOfBirthFrom,
          endDate: searchDto.dateOfBirthTo,
        });
      }
      
      const patients = await queryBuilder
        .leftJoinAndSelect('patient.appointments', 'appointments')
        .orderBy('patient.createdAt', 'DESC')
        .getMany();
      
      return patients.map(patient => this.mapEntityToResponse(patient));
    } catch (error) {
      this.logger.error(`Error searching patients: ${error.message}`, error.stack);
      throw new HttpException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private mapEntityToResponse(patient: DentalPatientEntity): PatientResponseDto {
    return {
      id: patient.id,
      firstName: patient.firstName,
      lastName: patient.lastName,
      nationality: patient.nationality,
      city: patient.city,
      address: patient.address,
      gender: patient.gender,
      cin: patient.cin,
      dateOfBirth: patient.dateOfBirth,
      insuranceType: patient.insuranceType,
      insuranceId: patient.insuranceId,
      phoneNumber: patient.phoneNumber,
      email: patient.email,
      emergencyContact: patient.emergencyContact,
      emergencyPhone: patient.emergencyPhone,
      medicalHistory: patient.medicalHistory,
      allergies: patient.allergies,
      medications: patient.medications,
      dentalChart: patient.dentalChart,
      appointments: patient.appointments || [],
      createdAt: patient.createdAt,
      updatedAt: patient.updatedAt,
    };
  }
}
