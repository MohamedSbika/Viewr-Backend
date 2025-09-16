import { Controller, Get, Post, Body, Param, Put, Delete, Logger, Inject } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from '@app/shared';
import { UpdatePermissionDto } from '@app/shared';
import { AssignPermissionToRoleDto } from '@app/shared';
import { FileLoggerService } from '@app/shared';

@Controller('auth/permissions')
export class PermissionController {
  private readonly logger = new Logger(PermissionController.name);

  constructor(
    private readonly permissionService: PermissionService,
    @Inject('FileLogger') private readonly fileLogger: FileLoggerService
  ) {
    this.logger.log('Permission controller initialized');
  }

  /**
   * Creates a new permission
   * @param {CreatePermissionDto} createPermissionDto - The permission data
   * @returns {Promise<any>} Created permission information
   */
  @Post()
  async createPermission(@Body() createPermissionDto: CreatePermissionDto): Promise<any> {
    const logMessage = `Creating new permission with action: ${createPermissionDto.action}`;
    this.fileLogger.log(logMessage, 'permission-create', PermissionController.name);
    return this.permissionService.createPermission(createPermissionDto);
  }

  /**
   * Gets all permissions
   * @returns {Promise<any>} List of all permissions
   */
  @Get()
  async getAllPermissions(): Promise<any> {
    const logMessage = 'Getting all permissions';
    this.fileLogger.log(logMessage, 'permission-get-all', PermissionController.name);
    return this.permissionService.getAllPermissions();
  }

  /**
   * Gets a specific permission by ID
   * @param {string} id - Permission ID
   * @returns {Promise<any>} The permission details
   */
  @Get(':id')
  async getPermissionById(@Param('id') id: string): Promise<any> {
    const logMessage = `Getting permission with ID: ${id}`;
    this.fileLogger.log(logMessage, 'permission-get-by-id', PermissionController.name);
    return this.permissionService.getPermissionById(id);
  }

  /**
   * Updates a permission
   * @param {string} id - Permission ID
   * @param {UpdatePermissionDto} updatePermissionDto - Updated permission data
   * @returns {Promise<any>} The updated permission
   */
  @Put(':id')
  async updatePermission(
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto
  ): Promise<any> {
    // Set the ID from the path parameter
    updatePermissionDto.id = id;
    
    const logMessage = `Updating permission with ID: ${id}`;
    this.fileLogger.log(logMessage, 'permission-update', PermissionController.name);
    return this.permissionService.updatePermission(updatePermissionDto);
  }

  /**
   * Deletes a permission
   * @param {string} id - Permission ID
   * @returns {Promise<any>} Result of the deletion
   */
  @Delete(':id')
  async deletePermission(@Param('id') id: string): Promise<any> {
    const logMessage = `Deleting permission with ID: ${id}`;
    this.fileLogger.log(logMessage, 'permission-delete', PermissionController.name);
    return this.permissionService.deletePermission(id);
  }

  /**
   * Assigns a permission to a role for a specific feature
   * @param {AssignPermissionToRoleDto} assignPermissionDto - Assignment data
   * @returns {Promise<any>} Result of the assignment
   */
  @Post('assign')
  async assignPermissionToRole(@Body() assignPermissionDto: AssignPermissionToRoleDto): Promise<any> {
    const logMessage = `Assigning permission ${assignPermissionDto.permissionId} to role ${assignPermissionDto.roleId} for feature ${assignPermissionDto.featureId}`;
    this.fileLogger.log(logMessage, 'permission-assign', PermissionController.name);
    return this.permissionService.assignPermissionToRole(assignPermissionDto);
  }

  /**
   * Gets all permissions assigned to a role
   * @param {string} roleId - Role ID
   * @returns {Promise<any>} Permissions assigned to the role
   */
  @Get('role/:roleId')
  async getPermissionsByRole(@Param('roleId') roleId: string): Promise<any> {
    const logMessage = `Getting permissions for role: ${roleId}`;
    this.fileLogger.log(logMessage, 'permission-get-by-role', PermissionController.name);
    return this.permissionService.getPermissionsByRole(roleId);
  }
}