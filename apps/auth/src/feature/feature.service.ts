import { Injectable, Logger, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FeatureAuth , UserAuth , RoleAuth , PermissionAuth ,RoleFeaturePermissionAuth  } from '@app/shared';
import { CreateFeatureDto } from './dto/create-feature.dto';
import { AssignFeatureDto } from './dto/assign-feature.dto';

@Injectable()
export class FeatureService {
  private readonly logger = new Logger(FeatureService.name);

  constructor(
    @InjectRepository(FeatureAuth)
    private featureRepository: Repository<FeatureAuth>,
    @InjectRepository(UserAuth)
    private userRepository: Repository<UserAuth>,
    @InjectRepository(RoleAuth)
    private roleRepository: Repository<RoleAuth>,
    @InjectRepository(PermissionAuth)
    private permissionRepository: Repository<PermissionAuth>,
    @InjectRepository(RoleFeaturePermissionAuth)
    private roleFeaturePermissionRepository: Repository<RoleFeaturePermissionAuth>,
  ) {}

  /**
   * Creates a new feature
   */
  async createFeature(createFeatureDto: CreateFeatureDto): Promise<any> {
    try {
      // Check if feature already exists
      const existingFeature = await this.featureRepository.findOne({
        where: { name: createFeatureDto.name }
      });
      
      if (existingFeature) {
        throw new ConflictException(`Feature with name ${createFeatureDto.name} already exists`);
      }

      // Create new feature
      const feature = this.featureRepository.create(createFeatureDto);
      const savedFeature = await this.featureRepository.save(feature);

      return {
        success: true,
        feature: savedFeature,
        message: 'Feature created successfully'
      };
    } catch (error) {
      this.logger.error(`Failed to create feature: ${error.message}`, error.stack);
      return {
        success: false,
        message: error.message || 'Failed to create feature'
      };
    }
  }

  /**
   * Assigns a feature to a role with a permission
   */
  async assignFeatureToRole(assignFeatureDto: AssignFeatureDto): Promise<any> {
    try {
      const { featureId, roleId, permissionId } = assignFeatureDto;
      
      // Check if feature exists
      const feature = await this.featureRepository.findOne({
        where: { id: featureId }
      });
      
      if (!feature) {
        throw new NotFoundException(`Feature with ID ${featureId} not found`);
      }
      
      // Check if role exists
      const role = await this.roleRepository.findOne({
        where: { id: roleId }
      });
      
      if (!role) {
        throw new NotFoundException(`Role with ID ${roleId} not found`);
      }
      
      // Check if permission exists
      const permission = await this.permissionRepository.findOne({
        where: { id: permissionId }
      });
      
      if (!permission) {
        throw new NotFoundException(`Permission with ID ${permissionId} not found`);
      }
      
      // Check if assignment already exists
      const existingAssignment = await this.roleFeaturePermissionRepository.findOne({
        where: {
          roleId,
          featureId,
          permissionId
        }
      });
      
      if (existingAssignment) {
        return {
          success: true,
          message: 'Feature is already assigned to this role with this permission',
          assignment: existingAssignment
        };
      }
      
      // Create new assignment
      const roleFeaturePermission = this.roleFeaturePermissionRepository.create({
        roleId,
        featureId,
        permissionId
      });
      
      const savedAssignment = await this.roleFeaturePermissionRepository.save(roleFeaturePermission);
      
      return {
        success: true,
        message: 'Feature assigned to role with permission successfully',
        assignment: savedAssignment
      };
    } catch (error) {
      this.logger.error(`Failed to assign feature to role: ${error.message}`, error.stack);
      return {
        success: false,
        message: error.message || 'Failed to assign feature to role'
      };
    }
  }

  /**
   * Gets all features accessible by a user
   */
  async getFeaturesByUser(userId: string): Promise<any> {
    try {
      // Find user with roles and roleFeaturePermissions
      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: ['roles', 'roles.roleFeaturePermissions', 'roles.roleFeaturePermissions.feature']
      });
      
      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }
      
      // Extract features from all roles
      const features: FeatureAuth[] = [];
      const featuresMap = new Map<string, FeatureAuth>();
      
      if (user.roles) {
        for (const role of user.roles) {
          if (role.roleFeaturePermissions) {
            for (const rfp of role.roleFeaturePermissions) {
              if (rfp.feature?.isActive && !featuresMap.has(rfp.feature.id)) {
                featuresMap.set(rfp.feature.id, rfp.feature);
                features.push(rfp.feature);
              }
            }
          }
        }
      }
      
      return {
        success: true,
        features,
        message: 'Features retrieved successfully'
      };
    } catch (error) {
      this.logger.error(`Failed to get features by user: ${error.message}`, error.stack);
      return {
        success: false,
        message: error.message || 'Failed to get features by user'
      };
    }
  }

  /**
   * Gets all features in the system
   */
  async getAllFeatures(): Promise<any> {
    try {
      const features = await this.featureRepository.find();
      
      return {
        success: true,
        features,
        message: 'Features retrieved successfully'
      };
    } catch (error) {
      this.logger.error(`Failed to get all features: ${error.message}`, error.stack);
      return {
        success: false,
        message: error.message || 'Failed to get all features'
      };
    }
  }

  /**
   * Remove feature from role
   * @param {string} featureId - Feature ID
   * @param {string} roleId - Role ID
   * @returns {Promise<{success: boolean, message: string}>} Removal result
   */
  async removeFeatureFromRole(featureId: string, roleId: string): Promise<{success: boolean, message: string}> {
    try {
      // Check if the role exists
      const role = await this.roleRepository.findOne({ where: { id: roleId } });
      if (!role) {
        return {
          success: false,
          message: `Role with ID ${roleId} not found`
        };
      }

      // Check if the feature exists
      const feature = await this.featureRepository.findOne({ where: { id: featureId } });
      if (!feature) {
        return {
          success: false,
          message: `Feature with ID ${featureId} not found`
        };
      }

      // Find all role-feature-permission relationships with this role and feature
      const roleFeaturePermissions = await this.roleFeaturePermissionRepository.find({
        where: { 
          role: { id: roleId },
          feature: { id: featureId }
        }
      });

      if (roleFeaturePermissions.length === 0) {
        return {
          success: false,
          message: 'Feature is not assigned to this role'
        };
      }

      // Remove all matching role-feature-permission relationships
      await this.roleFeaturePermissionRepository.remove(roleFeaturePermissions);

      this.logger.log(`Feature ${feature.name} removed from role ${role.title}`);
      return {
        success: true,
        message: 'Feature removed from role successfully'
      };
    } catch (error) {
      this.logger.error(`Error removing feature from role: ${error.message}`, error.stack);
      return {
        success: false,
        message: error.message || 'Failed to remove feature from role'
      };
    }
  }
}
