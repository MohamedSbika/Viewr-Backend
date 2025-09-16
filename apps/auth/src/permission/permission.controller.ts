import { Controller, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { AssignPermissionToRoleDto } from './dto/assign-permission.dto';
import { FileLoggerService } from '../logging/file-logger.service';

@Controller()
export class PermissionController {
  private readonly logger = new Logger(PermissionController.name);

  constructor(
    private readonly permissionService: PermissionService,
    private readonly fileLogger: FileLoggerService
  ) {}

  /**
   * Creates a new permission in the system
   * @param {CreatePermissionDto} createPermissionDto - The permission data
   * @returns {Promise<any>} Created permission information
   */
  @MessagePattern('permission.create')
  async createPermission(createPermissionDto: CreatePermissionDto): Promise<any> {
    const logMessage = `Creating new permission with action: ${createPermissionDto.action}`;
    this.fileLogger.log(logMessage, 'permission-create', PermissionController.name);
    return this.permissionService.createPermission(createPermissionDto);
  }

  /**
   * Gets all permissions in the system
   * @returns {Promise<any>} List of all permissions
   */
  @MessagePattern('permission.get-all')
  async getAllPermissions(): Promise<any> {
    const logMessage = 'Getting all permissions';
    this.fileLogger.log(logMessage, 'permission-get-all', PermissionController.name);
    return this.permissionService.getAllPermissions();
  }

  /**
   * Gets a permission by ID
   * @param {{id: string}} data - Object containing the permissionId
   * @returns {Promise<any>} Permission details
   */
  @MessagePattern('permission.get-by-id')
  async getPermissionById(data: { id: string }): Promise<any> {
    const logMessage = `Getting permission by ID: ${data.id}`;
    this.fileLogger.log(logMessage, 'permission-get-by-id', PermissionController.name);
    return this.permissionService.getPermissionById(data.id);
  }

  /**
   * Updates a permission
   * @param {UpdatePermissionDto} updatePermissionDto - The permission data to update
   * @returns {Promise<any>} Updated permission information
   */
  @MessagePattern('permission.update')
  async updatePermission(updatePermissionDto: UpdatePermissionDto): Promise<any> {
    const logMessage = `Updating permission with ID: ${updatePermissionDto.id}`;
    this.fileLogger.log(logMessage, 'permission-update', PermissionController.name);
    return this.permissionService.updatePermission(updatePermissionDto);
  }

  /**
   * Deletes a permission
   * @param {{id: string}} data - Object containing the permissionId
   * @returns {Promise<any>} Result of the delete operation
   */
  @MessagePattern('permission.delete')
  async deletePermission(data: { id: string }): Promise<any> {
    const logMessage = `Deleting permission with ID: ${data.id}`;
    this.fileLogger.log(logMessage, 'permission-delete', PermissionController.name);
    return this.permissionService.deletePermission(data.id);
  }

  /**
   * Assigns a permission to a role for a specific feature
   * @param {AssignPermissionToRoleDto} assignPermissionDto - Data for assigning permission
   * @returns {Promise<any>} Result of the assignment operation
   */
  @MessagePattern('permission.assign-to-role')
  async assignPermissionToRole(assignPermissionDto: AssignPermissionToRoleDto): Promise<any> {
    const logMessage = `Assigning permission ${assignPermissionDto.permissionId} to role ${assignPermissionDto.roleId} for feature ${assignPermissionDto.featureId}`;
    this.fileLogger.log(logMessage, 'permission-assign', PermissionController.name);
    return this.permissionService.assignPermissionToRole(assignPermissionDto);
  }

  /**
   * Gets permissions assigned to a role
   * @param {{roleId: string}} data - Object containing the roleId
   * @returns {Promise<any>} List of permissions assigned to the role
   */
  @MessagePattern('permission.get-by-role')
  async getPermissionsByRole(data: { roleId: string }): Promise<any> {
    const logMessage = `Getting permissions for role: ${data.roleId}`;
    this.fileLogger.log(logMessage, 'permission-get-by-role', PermissionController.name);
    return this.permissionService.getPermissionsByRole(data.roleId);
  }

  /**
   * Gets all permissions (alias for permission.get-all to match documented pattern)
   * @returns {Promise<any>} List of all permissions
   */
  @MessagePattern('permission.findAll')
  async findAll(): Promise<any> {
    const logMessage = 'Getting all permissions (findAll)';
    this.fileLogger.log(logMessage, 'permission-findAll', PermissionController.name);
    return this.permissionService.getAllPermissions();
  }

  /**
   * Assigns a permission to a role (alias for permission.assign-to-role to match documented pattern)
   * @param {AssignPermissionToRoleDto} assignPermissionDto - Data for assigning permission
   * @returns {Promise<any>} Result of the assignment operation
   */
  @MessagePattern('permission.assign')
  async assign(assignPermissionDto: AssignPermissionToRoleDto): Promise<any> {
    const logMessage = `Assigning permission ${assignPermissionDto.permissionId} to role ${assignPermissionDto.roleId}`;
    this.fileLogger.log(logMessage, 'permission-assign', PermissionController.name);
    return this.permissionService.assignPermissionToRole(assignPermissionDto);
  }

  /**
   * Remove permission from role
   * @param {{permissionId: string, roleId: string}} data - Object containing permission ID and role ID
   * @returns {Promise<{success: boolean, message: string}>} Removal result
   */
  @MessagePattern('permission.remove')
  async removePermissionFromRole(data: { permissionId: string; roleId: string }): Promise<{success: boolean, message: string}> {
    const logMessage = `Removing permission ${data.permissionId} from role ${data.roleId}`;
    this.fileLogger.log(logMessage, 'permission-remove', PermissionController.name);
    return this.permissionService.removePermissionFromRole(data.permissionId, data.roleId);
  }
}