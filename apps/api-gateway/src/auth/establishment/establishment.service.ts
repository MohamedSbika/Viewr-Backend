import { Injectable, Logger, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CreateEstablishmentDto } from '@app/shared';
import { UpdateEstablishmentDto } from '@app/shared';
import { EstablishmentResponseDto } from '@app/shared';

@Injectable()
export class EstablishmentService {
  private readonly logger = new Logger(EstablishmentService.name);

  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy
  ) {
    this.logger.log('Establishment Service initialized');
  }

  /**
   * Create a new establishment
   * @param {CreateEstablishmentDto} createEstablishmentDto - Establishment data
   * @returns {Promise<EstablishmentResponseDto>} The created establishment
   */
  async createEstablishment(createEstablishmentDto: CreateEstablishmentDto): Promise<EstablishmentResponseDto> {
    try {
      this.logger.log(`Creating establishment: ${createEstablishmentDto.name}`);
      return await firstValueFrom(
        this.authClient.send('establishment.create', createEstablishmentDto)
      );
    } catch (error) {
      this.logger.error(`Error creating establishment: ${error.message}`, error.stack);
      throw new HttpException(error.response || {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Get all establishments
   * @returns {Promise<EstablishmentResponseDto[]>} List of all establishments
   */
  async getAllEstablishments(): Promise<EstablishmentResponseDto[]> {
    try {
      this.logger.log('Getting all establishments');
      return await firstValueFrom(
        this.authClient.send('establishment.findAll', {})
      );
    } catch (error) {
      this.logger.error(`Error getting all establishments: ${error.message}`, error.stack);
      throw new HttpException(error.response || {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Get an establishment by ID
   * @param {string} id - Establishment ID
   * @returns {Promise<EstablishmentResponseDto>} The establishment
   */
  async getEstablishmentById(id: string): Promise<EstablishmentResponseDto> {
    try {
      this.logger.log(`Getting establishment with ID: ${id}`);
      return await firstValueFrom(
        this.authClient.send('establishment.findOne', { id })
      );
    } catch (error) {
      this.logger.error(`Error getting establishment by ID: ${error.message}`, error.stack);
      throw new HttpException(error.response || {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Update an establishment
   * @param {string} id - Establishment ID
   * @param {UpdateEstablishmentDto} updateEstablishmentDto - Updated establishment data
   * @returns {Promise<EstablishmentResponseDto>} The updated establishment
   */
  async updateEstablishment(id: string, updateEstablishmentDto: UpdateEstablishmentDto): Promise<EstablishmentResponseDto> {
    try {
      this.logger.log(`Updating establishment with ID: ${id}`);
      return await firstValueFrom(
        this.authClient.send('establishment.update', { id, updateEstablishmentDto })
      );
    } catch (error) {
      this.logger.error(`Error updating establishment: ${error.message}`, error.stack);
      throw new HttpException(error.response || {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Delete an establishment
   * @param {string} id - Establishment ID
   * @returns {Promise<void>}
   */
  async deleteEstablishment(id: string): Promise<void> {
    try {
      this.logger.log(`Deleting establishment with ID: ${id}`);
      return await firstValueFrom(
        this.authClient.send('establishment.remove', { id })
      );
    } catch (error) {   
      this.logger.error(`Error deleting establishment: ${error.message}`, error.stack);
      throw new HttpException(error.response || {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}