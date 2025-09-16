import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { HttpStatus } from '@nestjs/common';
import { UserAuth, UserProfileAuth, RoleAuth, EstablishmentAuth } from '@app/shared';
import { UserDto } from './dto/user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserProfileDto, SessionDto, AuditLogDto } from './dto/additional.dto';
import { RedisService } from '@app/shared';
import { REDIS_KEYS, buildRedisKey } from '@app/shared';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(UserAuth)
    private readonly userRepository: Repository<UserAuth>,
    @InjectRepository(UserProfileAuth)
    private readonly userProfileRepository: Repository<UserProfileAuth>,
    @InjectRepository(RoleAuth)
    private readonly roleRepository: Repository<RoleAuth>,
    @InjectRepository(EstablishmentAuth)
    private readonly establishmentRepository: Repository<EstablishmentAuth>,
    private readonly redisService: RedisService,
  ) {}

  /**
   * Get all users
   * @returns {Promise<{users: UserDto[]}>} All users
   */
  async findAll(): Promise<{users: UserDto[]}> {
    const users = await this.userRepository.find({
      relations: ['profile', 'roles', 'establishment']
    });

    const userDtos: UserDto[] = users.map(user => ({
      id: user.id,
      email: user.email,
      phone_number: user.phone_number,
      is_verified: user.is_verified,
      profile: {
        FirstName: user.profile.FirstName,
        LastName: user.profile.LastName,
        address: user.profile.address,
        gender: user.profile.gender,
        CIN: user.profile.CIN,
        DOB: user.profile.DOB
      },
      roles: user.roles?.map(role => ({
        id: role.id,
        title: role.title
      })),
      establishment: user.establishment ? {
        id: user.establishment.id,
        name: user.establishment.name
      } : undefined
    }));

    return { users: userDtos };
  }

  /**
   * Get user by ID
   * @param {string} userId - User ID
   * @returns {Promise<{user: UserDto}>} User data
   */
  async findOne(userId: string): Promise<{user: UserDto}> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['profile', 'roles', 'establishment']
    });

    if (!user) {
      throw new RpcException({
        statusCode: HttpStatus.NOT_FOUND,
        error: 'Not Found',
        message: 'User not found'
      });
    }

    const userDto: UserDto = {
      id: user.id,
      email: user.email,
      phone_number: user.phone_number,
      is_verified: user.is_verified,
      profile: {
        FirstName: user.profile.FirstName,
        LastName: user.profile.LastName,
        address: user.profile.address,
        gender: user.profile.gender,
        CIN: user.profile.CIN,
        DOB: user.profile.DOB
      },
      roles: user.roles?.map(role => ({
        id: role.id,
        title: role.title
      })),
      establishment: user.establishment ? {
        id: user.establishment.id,
        name: user.establishment.name
      } : undefined
    };

    return { user: userDto };
  }

  /**
   * Update user information
   * @param {string} userId - User ID
   * @param {UpdateUserDto} updateData - Data to update
   * @returns {Promise<{user: UserDto}>} Updated user data
   */
  async update(userId: string, updateData: UpdateUserDto): Promise<{user: UserDto}> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['profile', 'roles', 'establishment']
    });

    if (!user) {
      throw new RpcException({
        statusCode: HttpStatus.NOT_FOUND,
        error: 'Not Found',
        message: 'User not found'
      });
    }

    const queryRunner = this.userRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Update user fields
      if (updateData.email) user.email = updateData.email;
      if (updateData.phone_number) user.phone_number = updateData.phone_number;
      if (updateData.is_verified !== undefined) user.is_verified = updateData.is_verified;

      // Update profile if provided
      if (updateData.profile) {
        if (updateData.profile.FirstName) user.profile.FirstName = updateData.profile.FirstName;
        if (updateData.profile.LastName) user.profile.LastName = updateData.profile.LastName;
        if (updateData.profile.address) user.profile.address = updateData.profile.address;
        if (updateData.profile.gender) user.profile.gender = updateData.profile.gender;
        if (updateData.profile.CIN) user.profile.CIN = updateData.profile.CIN;
        if (updateData.profile.DOB) user.profile.DOB = updateData.profile.DOB;

        await queryRunner.manager.save(user.profile);
      }

      // Update establishment if provided
      if (updateData.establishment_id) {
        const establishment = await queryRunner.manager.findOne(EstablishmentAuth, {
          where: { id: updateData.establishment_id }
        });
        if (establishment) {
          user.establishment = establishment;
        }
      }

      await queryRunner.manager.save(user);
      await queryRunner.commitTransaction();

      // Fetch updated user with relations
      const updatedUser = await this.userRepository.findOne({
        where: { id: userId },
        relations: ['profile', 'roles', 'establishment']
      });

      if (!updatedUser) {
        throw new RpcException({
          statusCode: HttpStatus.NOT_FOUND,
          error: 'Not Found',
          message: 'Updated user not found'
        });
      }

      const userDto: UserDto = {
        id: updatedUser.id,
        email: updatedUser.email,
        phone_number: updatedUser.phone_number,
        is_verified: updatedUser.is_verified,
        profile: {
          FirstName: updatedUser.profile.FirstName,
          LastName: updatedUser.profile.LastName,
          address: updatedUser.profile.address,
          gender: updatedUser.profile.gender,
          CIN: updatedUser.profile.CIN,
          DOB: updatedUser.profile.DOB
        },
        roles: updatedUser.roles?.map(role => ({
          id: role.id,
          title: role.title
        })),
        establishment: updatedUser.establishment ? {
          id: updatedUser.establishment.id,
          name: updatedUser.establishment.name
        } : undefined
      };

      return { user: userDto };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new RpcException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Internal Server Error',
        message: error.message || 'Error updating user'
      });
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Delete user
   * @param {string} userId - User ID
   * @returns {Promise<{success: boolean, message: string}>} Delete result
   */
  async remove(userId: string): Promise<{success: boolean, message: string}> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['profile']
    });

    if (!user) {
      throw new RpcException({
        statusCode: HttpStatus.NOT_FOUND,
        error: 'Not Found',
        message: 'User not found'
      });
    }

    const queryRunner = this.userRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Remove user (this will cascade delete profile due to cascade: true)
      await queryRunner.manager.remove(user);
      await queryRunner.commitTransaction();

      this.logger.log(`User ${userId} deleted successfully`);
      return {
        success: true,
        message: 'User deleted successfully'
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new RpcException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Internal Server Error',
        message: error.message || 'Error deleting user'
      });
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Get user profile
   * @param {string} userId - User ID
   * @returns {Promise<{profile: UserProfileDto}>} User profile data
   */
  async getProfile(userId: string): Promise<{profile: UserProfileDto}> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['profile']
    });

    if (!user || !user.profile) {
      throw new RpcException({
        statusCode: HttpStatus.NOT_FOUND,
        error: 'Not Found',
        message: 'User or profile not found'
      });
    }

    const profile: UserProfileDto = {
      FirstName: user.profile.FirstName,
      LastName: user.profile.LastName,
      address: user.profile.address,
      gender: user.profile.gender,
      CIN: user.profile.CIN,
      DOB: user.profile.DOB
    };

    return { profile };
  }

  /**
   * Update user profile
   * @param {string} userId - User ID
   * @param {Partial<UserProfileDto>} profileData - Profile data to update
   * @returns {Promise<{profile: UserProfileDto}>} Updated profile data
   */
  async updateProfile(userId: string, profileData: Partial<UserProfileDto>): Promise<{profile: UserProfileDto}> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['profile']
    });

    if (!user || !user.profile) {
      throw new RpcException({
        statusCode: HttpStatus.NOT_FOUND,
        error: 'Not Found',
        message: 'User or profile not found'
      });
    }

    // Update profile fields
    if (profileData.FirstName) user.profile.FirstName = profileData.FirstName;
    if (profileData.LastName) user.profile.LastName = profileData.LastName;
    if (profileData.address) user.profile.address = profileData.address;
    if (profileData.gender) user.profile.gender = profileData.gender as any;
    if (profileData.CIN) user.profile.CIN = profileData.CIN;
    if (profileData.DOB) user.profile.DOB = profileData.DOB;

    await this.userProfileRepository.save(user.profile);

    const profile: UserProfileDto = {
      FirstName: user.profile.FirstName,
      LastName: user.profile.LastName,
      address: user.profile.address,
      gender: user.profile.gender,
      CIN: user.profile.CIN,
      DOB: user.profile.DOB
    };

    return { profile };
  }

  /**
   * Get active sessions for user (simplified using Redis refresh tokens)
   * @param {string} userId - User ID
   * @returns {Promise<{sessions: SessionDto[]}>} List of active sessions
   */
  async getSessions(userId: string): Promise<{sessions: SessionDto[]}> {
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new RpcException({
          statusCode: HttpStatus.NOT_FOUND,
          error: 'Not Found',
          message: 'User not found'
        });
      }

      // Get all refresh tokens for the user from Redis
      const refreshTokenPattern = buildRedisKey(REDIS_KEYS.AUTH.REFRESH_TOKEN, user.email, '*');
      const tokenKeys = await this.redisService.scanPattern(refreshTokenPattern);

      const sessions: SessionDto[] = tokenKeys.map((key, index) => ({
        id: key.split(':').pop() || `session-${index}`,
        userId: user.id,
        userAgent: 'Unknown',
        ipAddress: 'Unknown',
        lastActivity: new Date(),
        createdAt: new Date(),
        isActive: true
      }));

      return { sessions };
    } catch (error) {
      this.logger.error(`Error getting user sessions: ${error.message}`, error.stack);
      throw new RpcException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Internal Server Error',
        message: 'Error getting user sessions'
      });
    }
  }

  /**
   * Revoke specific session (simplified using Redis key deletion)
   * @param {string} sessionId - Session ID
   * @returns {Promise<{success: boolean, message: string}>} Revoke result
   */
  async revokeSession(sessionId: string): Promise<{success: boolean, message: string}> {
    try {
      // In a simplified implementation, sessionId is the refresh token key suffix
      // We'd need to scan for keys containing this ID
      const allKeys = await this.redisService.keys('refresh_token:*');
      const sessionKey = allKeys.find(key => key.endsWith(sessionId));

      if (sessionKey) {
        await this.redisService.del(sessionKey);
        return {
          success: true,
          message: 'Session revoked successfully'
        };
      }

      return {
        success: false,
        message: 'Session not found'
      };
    } catch (error) {
      this.logger.error(`Error revoking session: ${error.message}`, error.stack);
      return {
        success: false,
        message: 'Error revoking session'
      };
    }
  }

  /**
   * Revoke all sessions for user
   * @param {string} userId - User ID
   * @returns {Promise<{success: boolean, message: string}>} Revoke result
   */
  async revokeAllSessions(userId: string): Promise<{success: boolean, message: string}> {
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new RpcException({
          statusCode: HttpStatus.NOT_FOUND,
          error: 'Not Found',
          message: 'User not found'
        });
      }

      // Remove all refresh tokens for the user
      const refreshTokenPattern = buildRedisKey(REDIS_KEYS.AUTH.REFRESH_TOKEN, user.email, '*');
      const tokenKeys = await this.redisService.scanPattern(refreshTokenPattern);
      
      if (tokenKeys.length > 0) {
        await this.redisService.delMultiple(tokenKeys);
      }

      return {
        success: true,
        message: `Revoked ${tokenKeys.length} sessions`
      };
    } catch (error) {
      this.logger.error(`Error revoking all sessions: ${error.message}`, error.stack);
      return {
        success: false,
        message: 'Error revoking sessions'
      };
    }
  }

  /**
   * Get audit logs with optional filtering (simplified implementation)
   * @param {any} filters - Filter parameters
   * @returns {Promise<{logs: AuditLogDto[], total: number}>} Audit logs
   */
  async getAuditLogs(filters: {startDate?: string, endDate?: string, userId?: string, action?: string}): Promise<{logs: AuditLogDto[], total: number}> {
    // In a real implementation, this would query an audit_logs table
    // For now, return a placeholder response
    const logs: AuditLogDto[] = [];
    
    return {
      logs,
      total: 0
    };
  }

  /**
   * Get audit logs for specific user (simplified implementation)
   * @param {string} userId - User ID
   * @param {string} startDate - Start date filter
   * @param {string} endDate - End date filter
   * @returns {Promise<{logs: AuditLogDto[], total: number}>} User audit logs
   */
  async getUserAuditLogs(userId: string, startDate?: string, endDate?: string): Promise<{logs: AuditLogDto[], total: number}> {
    // In a real implementation, this would query an audit_logs table filtered by user
    // For now, return a placeholder response
    const logs: AuditLogDto[] = [];
    
    return {
      logs,
      total: 0
    };
  }
}
