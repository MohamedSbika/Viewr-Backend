import { Injectable, Logger, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { createBiologyPatientDto } from '@app/shared';
import { UpdateBiologyPatientDto } from '@app/shared';
import { PatientBiologyResponseDto } from '@app/shared';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class patientService {
  private readonly logger = new Logger(patientService.name);

  constructor(
    @Inject('BIOLOGY_SERVICE') private readonly bioClient: ClientProxy
  ) {
    this.logger.log('Patient Service initialized');
  }

  async create(createPatientDto: createBiologyPatientDto): Promise<PatientBiologyResponseDto> {
    this.logger.log(`Sending request to create patient: ${JSON.stringify(createPatientDto)}`);
    try {
      const newPatient = await firstValueFrom(
        this.bioClient.send<PatientBiologyResponseDto, createBiologyPatientDto>('patient.create', createPatientDto)
      );
      this.logger.log(`Received response for patient creation: ${JSON.stringify(newPatient)}`);
      return newPatient;
    } catch (error) {
      this.logger.error(`Error during patient creation RPC call: ${error.message}`, error.stack);

      throw new HttpException(error.response || {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);

    }
  }

  async findAll(): Promise<PatientBiologyResponseDto[]> {
    this.logger.log(`Sending request to fetch all patients`);
    try {
      const patients = await firstValueFrom(
        this.bioClient.send<PatientBiologyResponseDto[], {}>('patient.findAll', {})
      );
      this.logger.log(`Received response for fetching all patients: ${patients.length} found`);
      return patients;
    } catch (error) {
      this.logger.error(`Error during fetch all patients RPC call: ${error.message}`, error.stack);

      throw new HttpException(error.response || {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);

    }
  }
  async findById(id: string): Promise<PatientBiologyResponseDto> {

    try {
      const patient = await firstValueFrom(
        this.bioClient.send<PatientBiologyResponseDto>('patient.findOne', { id })
      );
      return patient;

    } catch (error) {
      this.logger.error(`Error during fetch  patient RPC call: ${error.message}`, error.stack);
      throw new HttpException(error.response || {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);

    }
  }
async updatePatient(id: string , data : UpdateBiologyPatientDto): Promise<PatientBiologyResponseDto> {

        try {
            const patient = await firstValueFrom(
                this.bioClient.send<PatientBiologyResponseDto>('patient.update', { id, updatePatientDto:data })
            );
            return patient;

        } catch (error) {
            this.logger.error(`Error during update patient RPC call: ${error.message}`, error.stack);
            throw new HttpException(error.response || {
              statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
              error: error.error,
              message: error.message
            }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
      
        }
    }
 async delete(id: string): Promise<PatientBiologyResponseDto> {

        try {
            const patient = await firstValueFrom(
                this.bioClient.send<PatientBiologyResponseDto>('patient.remove', { id })
            );
            return patient;

        } catch (error) {
            this.logger.error(`Error during deleting patient RPC call: ${error.message}`, error.stack);
            throw new HttpException(error.response || {
              statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
              error: error.error,
              message: error.message
            }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
      
        }
    }

}