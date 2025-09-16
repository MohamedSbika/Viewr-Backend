import { Controller, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleResponseDto } from './dto/role-response.dto';
import { FileLoggerService } from '../logging/file-logger.service';

@Controller()
export class RoleController {
  private readonly logger = new Logger(RoleController.name);

  constructor(
    private readonly roleService: RoleService,
    private readonly fileLogger: FileLoggerService
  ) {}

  /**
   * Creates a new role
   * @param {CreateRoleDto} createRoleDto - The role data
   * @returns {Promise<RoleResponseDto>} Created role information
   */
  @MessagePattern('role.create')
  async create(createRoleDto: CreateRoleDto): Promise<RoleResponseDto> {
    const logMessage = `Creating new role: ${createRoleDto.title}`;
    this.fileLogger.log(logMessage, 'role-create', RoleController.name);
    return this.roleService.create(createRoleDto);
  }

  /**
   * Gets all roles
   * @returns {Promise<RoleResponseDto[]>} List of all roles
   */
  @MessagePattern('role.findAll')
  async findAll(): Promise<RoleResponseDto[]> {
    const logMessage = 'Getting all roles';
    this.fileLogger.log(logMessage, 'role-findAll', RoleController.name);
    return this.roleService.findAll();
  }

  /**
   * Gets a specific role by ID
   * @param {{id: string}} data - Object containing the role ID
   * @returns {Promise<RoleResponseDto>} The role details
   */
  @MessagePattern('role.findOne')
  async findOne(data: { id: string }): Promise<RoleResponseDto> {
    const logMessage = `Getting role with ID: ${data.id}`;
    this.fileLogger.log(logMessage, 'role-findOne', RoleController.name);
    return this.roleService.findOne(data.id);
  }

  /**
   * Updates a role
   * @param {{id: string, updateRoleDto: UpdateRoleDto}} data - Object containing ID and update data
   * @returns {Promise<RoleResponseDto>} The updated role
   */
  @MessagePattern('role.update')
  async update(data: { id: string; updateRoleDto: UpdateRoleDto }): Promise<RoleResponseDto> {
    const logMessage = `Updating role with ID: ${data.id}`;
    this.fileLogger.log(logMessage, 'role-update', RoleController.name);
    return this.roleService.update(data.id, data.updateRoleDto);
  }

  /**
   * Deletes a role
   * @param {{id: string}} data - Object containing the role ID
   * @returns {Promise<void>}
   */
  @MessagePattern('role.remove')
  async remove(data: { id: string }): Promise<void> {
    const logMessage = `Removing role with ID: ${data.id}`;
    this.fileLogger.log(logMessage, 'role-remove', RoleController.name);
    return this.roleService.remove(data.id);
  }

  /**
   * Assign role to user
   * @param {{userId: string, roleId: string}} data - Object containing user ID and role ID
   * @returns {Promise<{success: boolean, message: string}>} Assignment result
   */
  @MessagePattern('role.assign-user')
  async assignUserToRole(data: { userId: string; roleId: string }): Promise<{success: boolean, message: string}> {
    const logMessage = `Assigning role ${data.roleId} to user ${data.userId}`;
    this.fileLogger.log(logMessage, 'role-assign-user', RoleController.name);
    return this.roleService.assignUserToRole(data.userId, data.roleId);
  }

  /**
   * Remove role from user
   * @param {{userId: string, roleId: string}} data - Object containing user ID and role ID
   * @returns {Promise<{success: boolean, message: string}>} Removal result
   */
  @MessagePattern('role.remove-user')
  async removeUserFromRole(data: { userId: string; roleId: string }): Promise<{success: boolean, message: string}> {
    const logMessage = `Removing role ${data.roleId} from user ${data.userId}`;
    this.fileLogger.log(logMessage, 'role-remove-user', RoleController.name);
    return this.roleService.removeUserFromRole(data.userId, data.roleId);
  }
}