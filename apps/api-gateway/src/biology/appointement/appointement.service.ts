import { Injectable, Logger, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { CreateBiologyAppointmentDto ,UpdateBiologyAppointmentDto,AppointmenResponseDto } from '@app/shared';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AppointementService {
  private readonly logger = new Logger(AppointementService.name);

  constructor(
    @Inject('BIOLOGY_SERVICE') private readonly bioClient: ClientProxy
  ) {
    this.logger.log('Appointement Service initialized');
  }

  async create(createAppointementDto: CreateBiologyAppointmentDto): Promise<AppointmenResponseDto> {
    this.logger.log(`Sending request to create appointement: ${JSON.stringify(createAppointementDto)}`);
    try {
      const newAppointement = await firstValueFrom(
        this.bioClient.send<AppointmenResponseDto, CreateBiologyAppointmentDto>('appointement.create', createAppointementDto)
      );
      this.logger.log(`Received response for appointement creation: ${JSON.stringify(newAppointement)}`);
      return newAppointement;
    } catch (error) {
      this.logger.error(`Error during appointement creation RPC call: ${error}`, error.stack);
      throw new RpcException({
        message: 'Failed to create appointement',
        statusCode: 400
      });
    }
  }

  async findAll(): Promise<AppointmenResponseDto[]> {
    this.logger.log('Sending request to fetch all appointments');
    try {
      const appointments = await firstValueFrom(
        this.bioClient.send<AppointmenResponseDto[]>('appointement.findAll', {})
      );
      this.logger.log(`Received response for fetching all appointments: ${JSON.stringify(appointments)}`);
      return appointments;
    } catch (error) {
      this.logger.error(`Error during fetch all appointments RPC call: ${error.message}`, error.stack);
      if (error instanceof RpcException) ({
        message: 'Failed to fetch appointement',
        statusCode: 500
      })
      throw new RpcException(`Failed to fetch all appointments: ${error.message || error}`);
    }
  }
  async findById(id: string): Promise<AppointmenResponseDto> {

    try {
      const appointement = await firstValueFrom(
        this.bioClient.send<AppointmenResponseDto>('appointement.findOne', { id })
      );
      return appointement;

    } catch (error) {
      this.logger.error(`Error during fetch  appointement RPC call: ${error.message}`, error.stack);
      if (error instanceof RpcException) ({
        message: 'Failed to fetch appointement',
        statusCode: 500
      })
      throw new RpcException(`Failed to fetch  appointement: ${error.message || error}`);
    }
  }
  async updateAppointement(id: string, data: UpdateBiologyAppointmentDto): Promise<AppointmenResponseDto> {

    try {
      const appointement = await firstValueFrom(
        this.bioClient.send<AppointmenResponseDto>('appointement.update', { id, updateAppointementDto: data })
      );
      return appointement;

    } catch (error) {
      this.logger.error(`Error during fetch  appointement RPC call: ${error.message}`, error.stack);
      if (error instanceof RpcException) ({
        message: 'Failed to update analysis',
        statusCode: 500
      })
      throw new RpcException(`Failed to update analysis: ${error.message || error}`);
    }
  }
  async delete(id: string): Promise<AppointmenResponseDto> {

    try {
      const appointement = await firstValueFrom(
        this.bioClient.send<AppointmenResponseDto>('appointement.remove', { id })
      );
      return appointement;

    } catch (error) {
      this.logger.error(`Error during delete  appointement RPC call: ${error.message}`, error.stack);
      if (error instanceof RpcException) ({
        message: 'Failed to delete appointement',
        statusCode: 500
      })
      throw new RpcException(`Failed to delete appointement: ${error.message || error}`);
    }
  }

  async findPatientHistory (id:string): Promise <AppointmenResponseDto>{
    try {
      const appointement= await firstValueFrom (
        this.bioClient.send<AppointmenResponseDto> ('appointement.history', {id})
      );
    return appointement;
  } catch (error) {
    this.logger.error(`Error during getting  patient history RPC call: ${error.message}`, error.stack);
    if (error instanceof RpcException) ({
      message: 'Failed to fetch patient history ',
      statusCode: 500
    })
    throw new RpcException(`Failed to fetch patient history : ${error.message || error}`);
  }
  }
}


