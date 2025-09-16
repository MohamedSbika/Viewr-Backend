import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { PermissionAuth , RoleAuth ,FeatureAuth, RoleFeaturePermissionAuth } from '@app/shared';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { AssignPermissionToRoleDto } from './dto/assign-permission.dto';

@Injectable()
export class PermissionService {
  private readonly logger = new Logger(PermissionService.name);

  constructor(
    @InjectRepository(PermissionAuth)
    private readonly permissionRepository: Repository<PermissionAuth>,
    @InjectRepository(RoleAuth)
    private readonly roleRepository: Repository<RoleAuth>,
    @InjectRepository(FeatureAuth)
    private readonly featureRepository: Repository<FeatureAuth>,
    @InjectRepository(RoleFeaturePermissionAuth)
    private readonly roleFeaturePermissionRepository: Repository<RoleFeaturePermissionAuth>
  ) {}

  /**
   * Creates a new permission
   * @param {CreatePermissionDto} createPermissionDto - Permission data
   * @returns {Promise<Permission>} The created permission
   */
  async createPermission(createPermissionDto: CreatePermissionDto): Promise<PermissionAuth> {
    try {
      const permission = new PermissionAuth();
      permission.id = uuidv4();
      permission.action = createPermissionDto.action;

      return await this.permissionRepository.save(permission);
    } catch (error) {
      this.logger.error(`Error creating permission: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Gets all permissions in the system
   * @returns {Promise<Permission[]>} List of all permissions
   */
  async getAllPermissions(): Promise<PermissionAuth[]> {
    try {
      return await this.permissionRepository.find();
    } catch (error) {
      this.logger.error(`Error retrieving all permissions: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Gets a permission by ID
   * @param {string} id - Permission ID
   * @returns {Promise<Permission>} The requested permission
   */
  async getPermissionById(id: string): Promise<PermissionAuth> {
    try {
      const permission = await this.permissionRepository.findOne({ where: { id } });
      
      if (!permission) {
        throw new NotFoundException(`Permission with ID ${id} not found`);
      }
      
      return permission;
    } catch (error) {
      this.logger.error(`Error retrieving permission by ID ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Updates a permission
   * @param {UpdatePermissionDto} updatePermissionDto - Permission update data
   * @returns {Promise<Permission>} The updated permission
   */
  async updatePermission(updatePermissionDto: UpdatePermissionDto): Promise<PermissionAuth> {
    try {
      const permission = await this.getPermissionById(updatePermissionDto.id);
      
      if (updatePermissionDto.action) {
        permission.action = updatePermissionDto.action;
      }
      
      return await this.permissionRepository.save(permission);
    } catch (error) {
      this.logger.error(`Error updating permission ${updatePermissionDto.id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Deletes a permission
   * @param {string} id - Permission ID to delete
   * @returns {Promise<{ success: boolean; message: string }>} Result of the operation
   */
  async deletePermission(id: string): Promise<{ success: boolean; message: string }> {
    try {
      // First check if the permission exists
      const permission = await this.getPermissionById(id);
      
      // Check if this permission is used in any role-feature-permission
      const usages = await this.roleFeaturePermissionRepository.count({ 
        where: { permission: { id: permission.id } } 
      });
      
      if (usages > 0) {
        return {
          success: false,
          message: `Cannot delete permission with ID ${id} as it is assigned to ${usages} role-feature combinations`
        };
      }
      
      await this.permissionRepository.remove(permission);
      
      return {
        success: true,
        message: `Permission with ID ${id} successfully deleted`
      };
    } catch (error) {
      this.logger.error(`Error deleting permission ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Assigns a permission to a role for a specific feature
   * @param {AssignPermissionToRoleDto} assignPermissionDto - Assignment data
   * @returns {Promise<RoleFeaturePermission>} The created role-feature-permission relationship
   */
  async assignPermissionToRole(assignPermissionDto: AssignPermissionToRoleDto): Promise<RoleFeaturePermissionAuth> {
    try {
      // Check if the role exists
      const role = await this.roleRepository.findOne({ 
        where: { id: assignPermissionDto.roleId } 
      });
      
      if (!role) {
        throw new NotFoundException(`Role with ID ${assignPermissionDto.roleId} not found`);
      }
      
      // Check if the feature exists
      const feature = await this.featureRepository.findOne({ 
        where: { id: assignPermissionDto.featureId } 
      });
      
      if (!feature) {
        throw new NotFoundException(`Feature with ID ${assignPermissionDto.featureId} not found`);
      }
      
      // Check if the permission exists
      const permission = await this.permissionRepository.findOne({ 
        where: { id: assignPermissionDto.permissionId } 
      });
      
      if (!permission) {
        throw new NotFoundException(`Permission with ID ${assignPermissionDto.permissionId} not found`);
      }
      
      // Check if this assignment already exists
      const existingAssignment = await this.roleFeaturePermissionRepository.findOne({
        where: {
          role: { id: role.id },
          feature: { id: feature.id },
          permission: { id: permission.id }
        }
      });
      
      if (existingAssignment) {
        return existingAssignment; // The assignment already exists, return it
      }
      
      // Create new role-feature-permission relation
      const roleFeaturePermission = new RoleFeaturePermissionAuth();
      roleFeaturePermission.id = uuidv4();
      roleFeaturePermission.role = role;
      roleFeaturePermission.feature = feature;
      roleFeaturePermission.permission = permission;
      
      return await this.roleFeaturePermissionRepository.save(roleFeaturePermission);
    } catch (error) {
      this.logger.error(`Error assigning permission to role: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Gets permissions assigned to a role
   * @param {string} roleId - Role ID
   * @returns {Promise<Permission[]>} List of permissions assigned to the role
   */
  async getPermissionsByRole(roleId: string): Promise<PermissionAuth[]> {
    try {
      // Check if the role exists
      const role = await this.roleRepository.findOne({ where: { id: roleId } });
      
      if (!role) {
        throw new NotFoundException(`Role with ID ${roleId} not found`);
      }
      
      // Get all role-feature-permissions for this role
      const roleFeaturePermissions = await this.roleFeaturePermissionRepository.find({
        where: { role: { id: roleId } },
        relations: ['permission', 'feature']
      });
      
      // Extract unique permissions from the relationships
      const uniquePermissions = new Map<string, PermissionAuth>();
      
      roleFeaturePermissions.forEach(rfp => {
        if (rfp.permission && !uniquePermissions.has(rfp.permission.id)) {
          uniquePermissions.set(rfp.permission.id, rfp.permission);
        }
      });
      
      return Array.from(uniquePermissions.values());
    } catch (error) {
      this.logger.error(`Error retrieving permissions for role ${roleId}: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Remove permission from role
   * @param {string} permissionId - Permission ID
   * @param {string} roleId - Role ID
   * @returns {Promise<{success: boolean, message: string}>} Removal result
   */
  async removePermissionFromRole(permissionId: string, roleId: string): Promise<{success: boolean, message: string}> {
    try {
      // Check if the role exists
      const role = await this.roleRepository.findOne({ where: { id: roleId } });
      if (!role) {
        throw new NotFoundException(`Role with ID ${roleId} not found`);
      }

      // Check if the permission exists
      const permission = await this.permissionRepository.findOne({ where: { id: permissionId } });
      if (!permission) {
        throw new NotFoundException(`Permission with ID ${permissionId} not found`);
      }

      // Find all role-feature-permission relationships with this role and permission
      const roleFeaturePermissions = await this.roleFeaturePermissionRepository.find({
        where: { 
          role: { id: roleId },
          permission: { id: permissionId }
        }
      });

      if (roleFeaturePermissions.length === 0) {
        return {
          success: false,
          message: 'Permission is not assigned to this role'
        };
      }

      // Remove all matching role-feature-permission relationships
      await this.roleFeaturePermissionRepository.remove(roleFeaturePermissions);

      this.logger.log(`Permission ${permission.action} removed from role ${role.title}`);
      return {
        success: true,
        message: 'Permission removed from role successfully'
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error removing permission from role: ${error.message}`, error.stack);
      throw error;
    }
  }
}