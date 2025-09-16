import { Controller, Get, Post, Body, Param, Put, Delete, Logger, Inject } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from '@app/shared';
import { UpdateRoleDto } from '@app/shared';
import { RoleResponseDto } from '@app/shared';
import { FileLoggerService } from '@app/shared';

@Controller('auth/roles')
export class RoleApiController {
  private readonly logger = new Logger(RoleApiController.name);

  constructor(
    private readonly roleService: RoleService,
    @Inject('FileLogger') private readonly fileLogger: FileLoggerService
  ) {
    this.logger.log('Role controller initialized');
  }

  /**
   * Creates a new role
   * @param {CreateRoleDto} createRoleDto - The role data
   * @returns {Promise<RoleResponseDto>} Created role information
   */
  @Post()
  async createRole(@Body() createRoleDto: CreateRoleDto): Promise<RoleResponseDto> {
    const logMessage = `Creating new role: ${createRoleDto.title}`;
    this.fileLogger.log(logMessage, 'role-create', RoleApiController.name);
    return this.roleService.createRole(createRoleDto);
  }

  /**
   * Gets all roles
   * @returns {Promise<RoleResponseDto[]>} List of all roles
   */
  @Get()
  async getAllRoles(): Promise<RoleResponseDto[]> {
    const logMessage = 'Getting all roles';
    this.fileLogger.log(logMessage, 'role-findAll', RoleApiController.name);
    return this.roleService.getAllRoles();
  }

  /**
   * Gets a specific role by ID
   * @param {string} id - Role ID
   * @returns {Promise<RoleResponseDto>} The role details
   */
  @Get(':id')
  async getRoleById(@Param('id') id: string): Promise<RoleResponseDto> {
    const logMessage = `Getting role with ID: ${id}`;
    this.fileLogger.log(logMessage, 'role-findOne', RoleApiController.name);
    return this.roleService.getRoleById(id);
  }

  /**
   * Updates a role
   * @param {string} id - Role ID
   * @param {UpdateRoleDto} updateRoleDto - Updated role data
   * @returns {Promise<RoleResponseDto>} The updated role
   */
  @Put(':id')
  async updateRole(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto
  ): Promise<RoleResponseDto> {
    const logMessage = `Updating role with ID: ${id}`;
    this.fileLogger.log(logMessage, 'role-update', RoleApiController.name);
    return this.roleService.updateRole(id, updateRoleDto);
  }

  /**
   * Deletes a role
   * @param {string} id - Role ID
   * @returns {Promise<void>}
   */
  @Delete(':id')
  async deleteRole(@Param('id') id: string): Promise<void> {
    const logMessage = `Deleting role with ID: ${id}`;
    this.fileLogger.log(logMessage, 'role-remove', RoleApiController.name);
    return this.roleService.deleteRole(id);
  }
}