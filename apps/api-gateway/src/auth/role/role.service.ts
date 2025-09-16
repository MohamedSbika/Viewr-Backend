import { Injectable, Logger, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CreateRoleDto } from '@app/shared';
import { UpdateRoleDto } from '@app/shared';
import { RoleResponseDto } from '@app/shared';

@Injectable()
export class RoleService {
  private readonly logger = new Logger(RoleService.name);

  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy
  ) {
    this.logger.log('Role Service initialized');
  }

  /**
   * Create a new role
   * @param {CreateRoleDto} createRoleDto - Role data
   * @returns {Promise<RoleResponseDto>} The created role
   */
  async createRole(createRoleDto: CreateRoleDto): Promise<RoleResponseDto> {
    try {
      this.logger.log(`Creating role: ${createRoleDto.title}`);
      return await firstValueFrom(
        this.authClient.send('role.create', createRoleDto)
      );
    } catch (error) {
      this.logger.error(`Error creating role: ${error.message}`, error.stack);
      throw new HttpException(error.response || {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Get all roles
   * @returns {Promise<RoleResponseDto[]>} List of all roles
   */
  async getAllRoles(): Promise<RoleResponseDto[]> {
    try {
      this.logger.log('Getting all roles');
      return await firstValueFrom(
        this.authClient.send('role.findAll', {})
      );
    } catch (error) {
      this.logger.error(`Error getting all roles: ${error.message}`, error.stack);
      throw new HttpException(error.response || {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Get a role by ID
   * @param {string} id - Role ID
   * @returns {Promise<RoleResponseDto>} The role
   */
  async getRoleById(id: string): Promise<RoleResponseDto> {
    try {
      this.logger.log(`Getting role with ID: ${id}`);
      return await firstValueFrom(
        this.authClient.send('role.findOne', { id })
      );
    } catch (error) {
      this.logger.error(`Error getting role by ID: ${error.message}`, error.stack);
      throw new HttpException(error.response || {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Update a role
   * @param {string} id - Role ID
   * @param {UpdateRoleDto} updateRoleDto - Updated role data
   * @returns {Promise<RoleResponseDto>} The updated role
   */
  async updateRole(id: string, updateRoleDto: UpdateRoleDto): Promise<RoleResponseDto> {
    try {
      this.logger.log(`Updating role with ID: ${id}`);
      return await firstValueFrom(
        this.authClient.send('role.update', { id, updateRoleDto })
      );
    } catch (error) {
      this.logger.error(`Error updating role: ${error.message}`, error.stack);
      throw new HttpException(error.response || {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Delete a role
   * @param {string} id - Role ID
   * @returns {Promise<void>}
   */
  async deleteRole(id: string): Promise<void> {
    try {
      this.logger.log(`Deleting role with ID: ${id}`);
      return await firstValueFrom(
        this.authClient.send('role.remove', { id })
      );
    } catch (error) {
      this.logger.error(`Error deleting role: ${error.message}`, error.stack);
      throw new HttpException(error.response || {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}