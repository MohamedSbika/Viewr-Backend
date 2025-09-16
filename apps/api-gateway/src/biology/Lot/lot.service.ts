import { Injectable, Logger, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { CreateBiologyLotDto ,LotBiologyResponseDto ,UpdateLotDto } from '@app/shared';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class LotService {
  private readonly logger = new Logger(LotService.name);

  constructor(
    @Inject('BIOLOGY_SERVICE') private readonly bioClient: ClientProxy
  ) {
    this.logger.log('Lot Service initialized');
  }

  async create(createLot: CreateBiologyLotDto): Promise<LotBiologyResponseDto> {
    this.logger.log(`Sending request to create lot: ${JSON.stringify(createLot)}`);
    try {
      const newLot = await firstValueFrom(
        this.bioClient.send<LotBiologyResponseDto, CreateBiologyLotDto>('lot.create', createLot)
      );
      this.logger.log(`Received response for lot creation: ${JSON.stringify(newLot)}`);
      return newLot;
    } catch (error) {
      this.logger.error(`Error during lot creation RPC call: ${error.message}`, error.stack);

      throw new HttpException(error.response || {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);

    }
  }

  async findAll(): Promise<LotBiologyResponseDto[]> {
    this.logger.log(`Sending request to fetch all lot`);
    try {
      const Lot = await firstValueFrom(
        this.bioClient.send<LotBiologyResponseDto[], {}>('lot.findAll', {})
      );
      this.logger.log(`Received response for fetching all lot: ${Lot.length} found`);
      return Lot;
    } catch (error) {
      this.logger.error(`Error during fetch all lot RPC call: ${error.message}`, error.stack);

      throw new HttpException(error.response || {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);

    }
  }
  async findById(id: string): Promise<LotBiologyResponseDto> {

    try {
      const Lot = await firstValueFrom(
        this.bioClient.send<LotBiologyResponseDto>('lot.findOne', { id })
      );
      return Lot;

    } catch (error) {
      this.logger.error(`Error during fetch lot RPC call: ${error.message}`, error.stack);
      throw new HttpException(error.response || {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);

    }
  }
async updateLot(id: string , data : UpdateLotDto): Promise<LotBiologyResponseDto> {
  console.log(data)
        try {
            const Lot = await firstValueFrom(
                this.bioClient.send<LotBiologyResponseDto>('lot.update', { id,updateLot:data })
            );
            return Lot;

        } catch (error) {
            this.logger.error(`Error during lot RPC call: ${error.message}`, error.stack);
            throw new HttpException(error.response || {
              statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
              error: error.error,
              message: error.message
            }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
      
        }
    }
 async deleteLot(id: string): Promise<LotBiologyResponseDto> {

        try {
            const Lot = await firstValueFrom(
                this.bioClient.send<LotBiologyResponseDto>('lot.remove', { id })
            );
            return Lot;

        } catch (error) {
            this.logger.error(`Error during deleting lot RPC call: ${error.message}`, error.stack);
            throw new HttpException(error.response || {
              statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
              error: error.error,
              message: error.message
            }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
      
        }
    }

}