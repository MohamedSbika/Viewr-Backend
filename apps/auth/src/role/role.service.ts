import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { RoleAuth , UserAuth } from '@app/shared';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleResponseDto } from './dto/role-response.dto';

@Injectable()
export class RoleService {
  private readonly logger = new Logger(RoleService.name);

  constructor(
    @InjectRepository(RoleAuth)
    private roleRepository: Repository<RoleAuth>,
    @InjectRepository(UserAuth)
    private userRepository: Repository<UserAuth>,
  ) {}

  /**
   * Creates a new role
   * @param createRoleDto Role data to create
   * @returns The created role
   */
  async create(createRoleDto: CreateRoleDto): Promise<RoleResponseDto> {
    try {
      const existingRole = await this.roleRepository.findOne({ 
        where: { title: createRoleDto.title } 
      });

      if (existingRole) {
        throw new RpcException({
          message: `Role with title ${createRoleDto.title} already exists`,
          statusCode: 409
        });
      }

      const role = this.roleRepository.create(createRoleDto);
      const savedRole = await this.roleRepository.save(role);
      
      return this.mapToResponseDto(savedRole);
    } catch (error) {
      this.logger.error(`Failed to create role: ${error.message}`, error.stack);
      
      if (error instanceof RpcException) {
        throw error;
      }
      
      throw new RpcException({
        message: 'Failed to create role',
        statusCode: 400
      });
    }
  }

  /**
   * Gets all roles in the system
   * @returns List of all roles
   */
  async findAll(): Promise<RoleResponseDto[]> {
    try {
      const roles = await this.roleRepository.find();
      return roles.map(role => this.mapToResponseDto(role));
    } catch (error) {
      this.logger.error(`Failed to fetch roles: ${error.message}`, error.stack);
      throw new RpcException({
        message: 'Failed to fetch roles',
        statusCode: 500
      });
    }
  }

  /**
   * Gets a specific role by ID
   * @param id The role ID to find
   * @returns The requested role
   */
  async findOne(id: string): Promise<RoleResponseDto> {
    try {
      const role = await this.roleRepository.findOne({ 
        where: { id },
        relations: ['roleFeaturePermissions', 'roleFeaturePermissions.feature', 'roleFeaturePermissions.permission']
      });
      
      if (!role) {
        throw new NotFoundException(`Role with ID ${id} not found`);
      }
      
      return this.mapToResponseDto(role);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new RpcException({
          message: error.message,
          statusCode: 404
        });
      }
      
      this.logger.error(`Failed to fetch role: ${error.message}`, error.stack);
      throw new RpcException({
        message: 'Failed to fetch role',
        statusCode: 500
      });
    }
  }

  /**
   * Updates a role by ID
   * @param id The role ID to update
   * @param updateRoleDto The data to update
   * @returns The updated role
   */
  async update(id: string, updateRoleDto: UpdateRoleDto): Promise<RoleResponseDto> {
    try {
      const role = await this.roleRepository.findOne({ where: { id } });
      
      if (!role) {
        throw new NotFoundException(`Role with ID ${id} not found`);
      }

      // If changing title, check if new title already exists in another role
      if (updateRoleDto.title && updateRoleDto.title !== role.title) {
        const existingRole = await this.roleRepository.findOne({ 
          where: { title: updateRoleDto.title } 
        });

        if (existingRole) {
          throw new RpcException({
            message: `Role with title ${updateRoleDto.title} already exists`,
            statusCode: 409
          });
        }
      }

      const updatedRole = await this.roleRepository.save({
        ...role,
        ...updateRoleDto,
      });
      
      return this.mapToResponseDto(updatedRole);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new RpcException({
          message: error.message,
          statusCode: 404
        });
      }
      
      if (error instanceof RpcException) {
        throw error;
      }
      
      this.logger.error(`Failed to update role: ${error.message}`, error.stack);
      throw new RpcException({
        message: 'Failed to update role',
        statusCode: 400
      });
    }
  }

  /**
   * Deletes a role by ID
   * @param id The role ID to delete
   */
  async remove(id: string): Promise<void> {
    try {
      const role = await this.roleRepository.findOne({ 
        where: { id },
        relations: ['users', 'roleFeaturePermissions'] 
      });
      
      if (!role) {
        throw new NotFoundException(`Role with ID ${id} not found`);
      }

      // Check if role has associated users
      if (role.users && role.users.length > 0) {
        throw new RpcException({
          message: 'Cannot delete role as it is assigned to users',
          statusCode: 400
        });
      }

      await this.roleRepository.remove(role);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new RpcException({
          message: error.message,
          statusCode: 404
        });
      }
      
      if (error instanceof RpcException) {
        throw error;
      }
      
      this.logger.error(`Failed to remove role: ${error.message}`, error.stack);
      throw new RpcException({
        message: 'Failed to remove role',
        statusCode: 500
      });
    }
  }

  /**
   * Maps a Role entity to a RoleResponseDto
   * @param role The role entity to map
   * @returns RoleResponseDto
   */
  private mapToResponseDto(role: RoleAuth): RoleResponseDto {
    const responseDto = new RoleResponseDto();
    responseDto.id = role.id;
    responseDto.title = role.title;
    return responseDto;
  }

  /**
   * Assign role to user
   * @param userId The user ID
   * @param roleId The role ID
   * @returns Assignment result
   */
  async assignUserToRole(userId: string, roleId: string): Promise<{success: boolean, message: string}> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: ['roles']
      });

      if (!user) {
        throw new RpcException({
          message: `User with ID ${userId} not found`,
          statusCode: 404
        });
      }

      const role = await this.roleRepository.findOne({ where: { id: roleId } });

      if (!role) {
        throw new RpcException({
          message: `Role with ID ${roleId} not found`,
          statusCode: 404
        });
      }

      // Check if user already has this role
      const hasRole = user.roles?.some(userRole => userRole.id === roleId);
      if (hasRole) {
        return {
          success: false,
          message: 'User already has this role'
        };
      }

      // Add role to user
      if (!user.roles) {
        user.roles = [];
      }
      user.roles.push(role);
      await this.userRepository.save(user);

      this.logger.log(`Role ${role.title} assigned to user ${user.email}`);
      return {
        success: true,
        message: 'Role assigned successfully'
      };
    } catch (error) {
      if (error instanceof RpcException) {
        throw error;
      }

      this.logger.error(`Failed to assign role to user: ${error.message}`, error.stack);
      throw new RpcException({
        message: 'Failed to assign role to user',
        statusCode: 500
      });
    }
  }

  /**
   * Remove role from user
   * @param userId The user ID
   * @param roleId The role ID
   * @returns Removal result
   */
  async removeUserFromRole(userId: string, roleId: string): Promise<{success: boolean, message: string}> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: ['roles']
      });

      if (!user) {
        throw new RpcException({
          message: `User with ID ${userId} not found`,
          statusCode: 404
        });
      }

      const role = await this.roleRepository.findOne({ where: { id: roleId } });

      if (!role) {
        throw new RpcException({
          message: `Role with ID ${roleId} not found`,
          statusCode: 404
        });
      }

      // Check if user has this role
      const roleIndex = user.roles?.findIndex(userRole => userRole.id === roleId);
      if (roleIndex === -1 || roleIndex === undefined) {
        return {
          success: false,
          message: 'User does not have this role'
        };
      }

      // Remove role from user
      user.roles.splice(roleIndex, 1);
      await this.userRepository.save(user);

      this.logger.log(`Role ${role.title} removed from user ${user.email}`);
      return {
        success: true,
        message: 'Role removed successfully'
      };
    } catch (error) {
      if (error instanceof RpcException) {
        throw error;
      }

      this.logger.error(`Failed to remove role from user: ${error.message}`, error.stack);
      throw new RpcException({
        message: 'Failed to remove role from user',
        statusCode: 500
      });
    }
  }
}