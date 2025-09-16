import { Controller, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { FeatureService } from './feature.service';
import { CreateFeatureDto } from './dto/create-feature.dto';
import { AssignFeatureDto } from './dto/assign-feature.dto';
import { FileLoggerService } from '../logging/file-logger.service';

@Controller()
export class FeatureController {
  private readonly logger = new Logger(FeatureController.name);

  constructor(
    private readonly featureService: FeatureService,
    private readonly fileLogger: FileLoggerService
  ) {}

  /**
   * Creates a new feature in the system
   * @param {CreateFeatureDto} createFeatureDto - The feature data
   * @returns {Promise<any>} Created feature information
   */
  @MessagePattern('feature.create')
  async createFeature(createFeatureDto: CreateFeatureDto): Promise<any> {
    const logMessage = `Creating new feature: ${createFeatureDto.name}`;
    this.fileLogger.log(logMessage, 'feature-create', FeatureController.name);
    return this.featureService.createFeature(createFeatureDto);
  }

  /**
   * Assigns a feature to a role
   * @param {AssignFeatureDto} assignFeatureDto - Data containing featureId and roleId
   * @returns {Promise<any>} Assignment result
   */
  @MessagePattern('feature.assign')
  async assignFeatureToRole(assignFeatureDto: AssignFeatureDto): Promise<any> {
    const logMessage = `Assigning feature ${assignFeatureDto.featureId} to role ${assignFeatureDto.roleId}`;
    this.fileLogger.log(logMessage, 'feature-assign', FeatureController.name);
    return this.featureService.assignFeatureToRole(assignFeatureDto);
  }

  /**
   * Gets all features accessible by a user
   * @param {{userId: string}} data - Object containing the userId
   * @returns {Promise<any>} List of features the user has access to
   */
  @MessagePattern('feature.get-by-user')
  async getFeaturesByUser(data: { userId: string }): Promise<any> {
    const logMessage = `Getting features for user: ${data.userId}`;
    this.fileLogger.log(logMessage, 'feature-get-by-user', FeatureController.name);
    return this.featureService.getFeaturesByUser(data.userId);
  }

  /**
   * Gets all features in the system
   * @returns {Promise<any>} List of all features
   */
  @MessagePattern('feature.get-all')
  async getAllFeatures(): Promise<any> {
    const logMessage = 'Getting all features';
    this.fileLogger.log(logMessage, 'feature-get-all', FeatureController.name);
    return this.featureService.getAllFeatures();
  }

  /**
   * Remove feature from role
   * @param {{featureId: string, roleId: string}} data - Object containing feature ID and role ID
   * @returns {Promise<{success: boolean, message: string}>} Removal result
   */
  @MessagePattern('feature.remove')
  async removeFeatureFromRole(data: { featureId: string; roleId: string }): Promise<{success: boolean, message: string}> {
    const logMessage = `Removing feature ${data.featureId} from role ${data.roleId}`;
    this.fileLogger.log(logMessage, 'feature-remove', FeatureController.name);
    return this.featureService.removeFeatureFromRole(data.featureId, data.roleId);
  }
}
