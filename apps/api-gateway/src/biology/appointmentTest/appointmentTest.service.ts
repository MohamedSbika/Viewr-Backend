

import { Injectable, Logger, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { AppointmentTest , CreateAppointmentTestDto ,UpdateAppointmentTestDto } from '@app/shared';
import { AppointmenResponseDto } from '@app/shared';
import { AppointmentTestResponseDto } from '@app/shared';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class appointmentTestService {
  private readonly logger = new Logger(appointmentTestService.name);

  constructor(
    @Inject('BIOLOGY_SERVICE') private readonly bioClient: ClientProxy
  ) {
    this.logger.log('appointment Service initialized');
  }

  async create(createAppointmentTestDto: CreateAppointmentTestDto): Promise<AppointmentTestResponseDto> {
    this.logger.log(`Sending request to create appointmentTest: ${JSON.stringify(createAppointmentTestDto)}`);
    try {
      const newAppointmentTest = await firstValueFrom(
        this.bioClient.send<AppointmentTestResponseDto, CreateAppointmentTestDto>('appointmentTest.create', createAppointmentTestDto)
      );
      this.logger.log(`Received response for appointmentTest creation: ${JSON.stringify(newAppointmentTest)}`);
      return newAppointmentTest;
    } catch (error) {
      this.logger.error(`Error during appointmentTest creation RPC call: ${error.message}`, error.stack);

      throw new HttpException(error.response || {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);

    }
  }

  async findAll(): Promise<AppointmentTestResponseDto[]> {
    this.logger.log(`Sending request to fetch all appointment`);
    try {
      const AppointmentTest = await firstValueFrom(
        this.bioClient.send<AppointmentTestResponseDto[], {}>('appointmentTest.findAll', {})
      );
      this.logger.log(`Received response for fetching all appointment: ${AppointmentTest.length} found`);
      return AppointmentTest;
    } catch (error) {
      this.logger.error(`Error during fetch all appointmentTest RPC call: ${error.message}`, error.stack);

      throw new HttpException(error.response || {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);

    }
  }
  async findById(id: string): Promise<AppointmentTestResponseDto> {

    try {
      const AppointmentTest = await firstValueFrom(
        this.bioClient.send<AppointmentTestResponseDto>('appointmentTest.findOne', { id })
      );
      return AppointmentTest;

    } catch (error) {
      this.logger.error(`Error during fetch  appointmentTest RPC call: ${error.message}`, error.stack);
      throw new HttpException(error.response || {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);

    }
  }
async updateAppointmentTest(id: string , data : UpdateAppointmentTestDto): Promise<AppointmentTestResponseDto> {
  console.log(data)
        try {
            const AppointmentTest = await firstValueFrom(
                this.bioClient.send<AppointmentTestResponseDto>('appointmentTest.update', { id,updateAppointmentTestDto:data })
            );
            return AppointmentTest;

        } catch (error) {
            this.logger.error(`Error during task patient RPC call: ${error.message}`, error.stack);
            throw new HttpException(error.response || {
              statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
              error: error.error,
              message: error.message
            }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
      
        }
    }
 async delete(id: string): Promise<AppointmentTestResponseDto> {

        try {
            const AppointmentTest = await firstValueFrom(
                this.bioClient.send<AppointmentTestResponseDto>('appointmentTest.remove', { id })
            );
            return AppointmentTest;

        } catch (error) {
            this.logger.error(`Error during deleting appointmentTest RPC call: ${error.message}`, error.stack);
            throw new HttpException(error.response || {
              statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
              error: error.error,
              message: error.message
            }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
      
        }
    }

}