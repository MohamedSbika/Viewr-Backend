import { Injectable, Logger, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CreatePermissionDto } from '@app/shared';
import { UpdatePermissionDto } from '@app/shared';
import { AssignPermissionToRoleDto } from '@app/shared';

@Injectable()
export class PermissionService {
  private readonly logger = new Logger(PermissionService.name);

  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy
  ) {
    this.logger.log('Permission Service initialized');
  }

  /**
   * Create a new permission
   * @param {CreatePermissionDto} createPermissionDto - Permission data
   * @returns {Promise<any>} The created permission
   */
  async createPermission(createPermissionDto: CreatePermissionDto): Promise<any> {
    try {
      this.logger.log(`Creating permission with action: ${createPermissionDto.action}`);
      return await firstValueFrom(
        this.authClient.send('permission.create', createPermissionDto)
      );
    } catch (error) {
      this.logger.error(`Error creating permission: ${error.message}`, error.stack);
      throw new HttpException(error.response || {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Get all permissions
   * @returns {Promise<any>} List of all permissions
   */
  async getAllPermissions(): Promise<any> {
    try {
      this.logger.log('Getting all permissions');
      return await firstValueFrom(
        this.authClient.send('permission.get-all', {})
      );
    } catch (error) {
      this.logger.error(`Error getting all permissions: ${error.message}`, error.stack);
      throw new HttpException(error.response || {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Get a permission by ID
   * @param {string} id - Permission ID
   * @returns {Promise<any>} The permission
   */
  async getPermissionById(id: string): Promise<any> {
    try {
      this.logger.log(`Getting permission with ID: ${id}`);
      return await firstValueFrom(
        this.authClient.send('permission.get-by-id', { id })
      );
    } catch (error) {
      this.logger.error(`Error getting permission by ID: ${error.message}`, error.stack);
      throw new HttpException(error.response || {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Update a permission
   * @param {UpdatePermissionDto} updatePermissionDto - Updated permission data
   * @returns {Promise<any>} The updated permission
   */
  async updatePermission(updatePermissionDto: UpdatePermissionDto): Promise<any> {
    try {
      this.logger.log(`Updating permission with ID: ${updatePermissionDto.id}`);
      return await firstValueFrom(
        this.authClient.send('permission.update', updatePermissionDto)
      );
    } catch (error) {
      this.logger.error(`Error updating permission: ${error.message}`, error.stack);
      throw new HttpException(error.response || {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Delete a permission
   * @param {string} id - Permission ID
   * @returns {Promise<any>} Result of the delete operation
   */
  async deletePermission(id: string): Promise<any> {
    try {
      this.logger.log(`Deleting permission with ID: ${id}`);
      return await firstValueFrom(
        this.authClient.send('permission.delete', { id })
      );
    } catch (error) {
      this.logger.error(`Error deleting permission: ${error.message}`, error.stack);
      throw new HttpException(error.response || {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Assign permission to a role for a specific feature
   * @param {AssignPermissionToRoleDto} assignPermissionDto - Assignment data
   * @returns {Promise<any>} Result of the assignment operation
   */
  async assignPermissionToRole(assignPermissionDto: AssignPermissionToRoleDto): Promise<any> {
    try {
      this.logger.log(`Assigning permission ${assignPermissionDto.permissionId} to role ${assignPermissionDto.roleId} for feature ${assignPermissionDto.featureId}`);
      return await firstValueFrom(
        this.authClient.send('permission.assign-to-role', assignPermissionDto)
      );
    } catch (error) {
      this.logger.error(`Error assigning permission to role: ${error.message}`, error.stack);
      throw new HttpException(error.response || {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Get permissions by role
   * @param {string} roleId - Role ID
   * @returns {Promise<any>} Permissions assigned to the role
   */
  async getPermissionsByRole(roleId: string): Promise<any> {
    try {
      this.logger.log(`Getting permissions for role: ${roleId}`);
      return await firstValueFrom(
        this.authClient.send('permission.get-by-role', { roleId })
      );
    } catch (error) {
      this.logger.error(`Error getting permissions by role: ${error.message}`, error.stack);
      throw new HttpException(error.response || {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}