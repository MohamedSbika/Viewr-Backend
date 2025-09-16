import { Injectable, Logger, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CreateFeatureDto } from '@app/shared';
import { AssignFeatureDto } from '@app/shared';

@Injectable()
export class FeatureService {
  private readonly logger = new Logger(FeatureService.name);

  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy
  ) {
    this.logger.log('Feature Service initialized');
  }

  /**
   * Create a new feature
   * @param {CreateFeatureDto} createFeatureDto - Feature data
   * @returns {Promise<any>} The created feature
   */
  async createFeature(createFeatureDto: CreateFeatureDto): Promise<any> {
    try {
      this.logger.log(`Creating feature: ${createFeatureDto.name}`);
      return await firstValueFrom(
        this.authClient.send('feature.create', createFeatureDto)
      );
    } catch (error) {
      this.logger.error(`Error creating feature: ${error.message}`, error.stack);
      throw new HttpException(error.response || {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Assign a feature to a role
   * @param {AssignFeatureDto} assignFeatureDto - Data containing featureId and roleId
   * @returns {Promise<any>} Assignment result
   */
  async assignFeatureToRole(assignFeatureDto: AssignFeatureDto): Promise<any> {
    try {
      this.logger.log(`Assigning feature ${assignFeatureDto.featureId} to role ${assignFeatureDto.roleId}`);
      return await firstValueFrom(
        this.authClient.send('feature.assign', assignFeatureDto)
      );
    } catch (error) {
      this.logger.error(`Error assigning feature to role: ${error.message}`, error.stack);
      throw new HttpException(error.response || {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Get all features accessible by a user
   * @param {string} userId - The user ID
   * @returns {Promise<any>} List of features
   */
  async getFeaturesByUser(userId: string): Promise<any> {
    try {
      this.logger.log(`Getting features for user: ${userId}`);
      return await firstValueFrom(
        this.authClient.send('feature.get-by-user', { userId })
      );
    } catch (error) {
      this.logger.error(`Error getting features for user: ${error.message}`, error.stack);
      throw new HttpException(error.response || {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Get all features in the system
   * @returns {Promise<any>} List of all features
   */
  async getAllFeatures(): Promise<any> {
    try {
      this.logger.log('Getting all features');
      return await firstValueFrom(
        this.authClient.send('feature.get-all', {})
      );
    } catch (error) {
      this.logger.error(`Error getting all features: ${error.message}`, error.stack);
      throw new HttpException(error.response || {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}