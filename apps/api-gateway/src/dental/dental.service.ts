import { Injectable, Logger, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class DentalService {
  private readonly logger = new Logger(DentalService.name);

  constructor(
    @Inject('DENTIST_SERVICE') private readonly dentistClient: ClientProxy
  ) {
    this.logger.log('Dentist Service initialized');
  }

  /**
   * Check overall health of dentist microservice
   * @returns {Promise<any>} Health status
   */
  async checkHealth(): Promise<any> {
    try {
      this.logger.log('Checking dentist microservice health');
          return await firstValueFrom(
        this.dentistClient.send('dental.healthCheck', {})
      );

    } catch (error) {
      this.logger.error(`Error checking health: ${error.message}`, error.stack);
      throw new HttpException({
        statusCode: HttpStatus.SERVICE_UNAVAILABLE,
        error: 'Service Unavailable',
        message: 'Dentist service is not healthy'
      }, HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  /**
   * Get inventory module status
   * @returns {Promise<any>} Inventory status
   */
  async getInventoryStatus(): Promise<any> {
    try {
      this.logger.log('Getting inventory module status');
      return await firstValueFrom(
        this.dentistClient.send('inventory.status', {})
      );
    } catch (error) {
      this.logger.error(`Error getting inventory status: ${error.message}`, error.stack);
      throw new HttpException(error.response || {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Get task module status
   * @returns {Promise<any>} Task status
   */
  async getTaskStatus(): Promise<any> {
    try {
      this.logger.log('Getting task module status');
      return await firstValueFrom(
        this.dentistClient.send('task.status', {})
      );
    } catch (error) {
      this.logger.error(`Error getting task status: ${error.message}`, error.stack);
      throw new HttpException(error.response || {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
