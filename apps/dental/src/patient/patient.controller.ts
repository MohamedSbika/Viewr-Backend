import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PatientService } from './patient.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { UpdateDentalChartDto } from './dto/update-dental-chart.dto';
import { PatientSearchDto } from './dto/patient-search.dto';
import { PatientResponseDto } from './dto/patient-response.dto';

@Controller()
export class PatientController {
  private readonly logger = new Logger(PatientController.name);

  constructor(private readonly patientService: PatientService) {}

  @MessagePattern('patient.create')
  async createPatient(@Payload() createPatientDto: CreatePatientDto): Promise<PatientResponseDto> {
    this.logger.log('Creating patient');
    return this.patientService.createPatient(createPatientDto);
  }

  @MessagePattern('patient.findAll')
  async findAllPatients(): Promise<PatientResponseDto[]> {
    this.logger.log('Finding all patients');
    return this.patientService.findAllPatients();
  }

  @MessagePattern('patient.findById')
  async findPatientById(@Payload() payload: { id: string }): Promise<PatientResponseDto> {
    this.logger.log(`Finding patient by ID: ${payload.id}`);
    return this.patientService.findPatientById(payload.id);
  }

  @MessagePattern('patient.update')
  async updatePatient(@Payload() payload: { id: string; data: UpdatePatientDto }): Promise<PatientResponseDto> {
    this.logger.log(`Updating patient: ${payload.id}`);
    return this.patientService.updatePatient(payload.id, payload.data);
  }

  @MessagePattern('patient.remove')
  async removePatient(@Payload() payload: { id: string }): Promise<void> {
    this.logger.log(`Removing patient: ${payload.id}`);
    return this.patientService.removePatient(payload.id);
  }

  @MessagePattern('patient.updateDentalChart')
  async updateDentalChart(@Payload() payload: { id: string; data: UpdateDentalChartDto }): Promise<PatientResponseDto> {
    this.logger.log(`Updating dental chart for patient: ${payload.id}`);
    return this.patientService.updateDentalChart(payload.id, payload.data);
  }

  @MessagePattern('patient.search')
  async searchPatients(@Payload() searchDto: PatientSearchDto): Promise<PatientResponseDto[]> {
    this.logger.log('Searching patients');
    return this.patientService.searchPatients(searchDto);
  }
}
