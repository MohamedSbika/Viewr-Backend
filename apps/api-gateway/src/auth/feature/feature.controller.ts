import { Controller, Logger, Post, Body, Get, Param, Inject } from '@nestjs/common';
import { FeatureService } from './feature.service';
import { CreateFeatureDto } from '@app/shared';
import { AssignFeatureDto } from '@app/shared';
import { FileLoggerService } from '@app/shared';

@Controller('auth/features')
export class FeatureController {
  private readonly logger = new Logger(FeatureController.name);

  constructor(
    private readonly featureService: FeatureService,
    @Inject('FileLogger') private readonly fileLogger: FileLoggerService
  ) {
    this.logger.log('Feature controller initialized');
  }

  /**
   * Creates a new feature in the system
   * @param {CreateFeatureDto} createFeatureDto - The feature data
   * @returns {Promise<any>} Created feature information
   */
  @Post()
  async createFeature(@Body() createFeatureDto: CreateFeatureDto): Promise<any> {
    const logMessage = `Creating new feature: ${createFeatureDto.name}`;
    this.fileLogger.log(logMessage, 'feature-create', FeatureController.name);
    return this.featureService.createFeature(createFeatureDto);
  }

  /**
   * Assigns a feature to a role
   * @param {AssignFeatureDto} assignFeatureDto - Data containing featureId and roleId
   * @returns {Promise<any>} Assignment result
   */
  @Post('assign')
  async assignFeatureToRole(@Body() assignFeatureDto: AssignFeatureDto): Promise<any> {
    const logMessage = `Assigning feature ${assignFeatureDto.featureId} to role ${assignFeatureDto.roleId}`;
    this.fileLogger.log(logMessage, 'feature-assign', FeatureController.name);
    return this.featureService.assignFeatureToRole(assignFeatureDto);
  }

  /**
   * Gets all features accessible by a user
   * @param userId - The user ID
   * @returns {Promise<any>} List of features the user has access to
   */
  @Get('user/:userId')
  async getFeaturesByUser(@Param('userId') userId: string): Promise<any> {
    const logMessage = `Getting features for user: ${userId}`;
    this.fileLogger.log(logMessage, 'feature-get-by-user', FeatureController.name);
    return this.featureService.getFeaturesByUser(userId);
  }

  /**
   * Gets all features in the system
   * @returns {Promise<any>} List of all features
   */
  @Get()
  async getAllFeatures(): Promise<any> {
    const logMessage = 'Getting all features';
    this.fileLogger.log(logMessage, 'feature-get-all', FeatureController.name);
    return this.featureService.getAllFeatures();
  }
}