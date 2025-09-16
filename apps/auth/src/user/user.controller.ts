import { Controller, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { UserService } from './user.service';
import { UserDto } from './dto/user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserProfileDto, SessionDto, AuditLogDto } from './dto/additional.dto';
import { FileLoggerService } from '../logging/file-logger.service';

@Controller()
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(
    private readonly userService: UserService,
    private readonly fileLogger: FileLoggerService
  ) {}

  /**
   * Get all users
   * @description Retrieves all users in the system
   * @param {any} data - Input data (not used)
   * @returns {Promise<{users: UserDto[]}>} List of all users
   */
  @MessagePattern('user.findAll')
  async findAll(data: any): Promise<{users: UserDto[]}> {
    const logMessage = 'Get all users request received';
    this.fileLogger.log(logMessage, 'user-findAll', UserController.name);
    return this.userService.findAll();
  }

  /**
   * Get user by ID
   * @description Retrieves a specific user by their ID
   * @param {{userId: string}} data - Object containing the user ID
   * @returns {Promise<{user: UserDto}>} User data
   */
  @MessagePattern('user.findOne')
  async findOne(data: {userId: string}): Promise<{user: UserDto}> {
    const logMessage = `Get user request for ID: ${data.userId}`;
    this.fileLogger.log(logMessage, 'user-findOne', UserController.name);
    return this.userService.findOne(data.userId);
  }

  /**
   * Update user information
   * @description Updates user information with the provided data
   * @param {{userId: string, updateData: UpdateUserDto}} data - User ID and update data
   * @returns {Promise<{user: UserDto}>} Updated user data
   */
  @MessagePattern('user.update')
  async update(data: {userId: string, updateData: UpdateUserDto}): Promise<{user: UserDto}> {
    const logMessage = `Update user request for ID: ${data.userId}`;
    this.fileLogger.log(logMessage, 'user-update', UserController.name);
    return this.userService.update(data.userId, data.updateData);
  }

  /**
   * Delete user
   * @description Removes a user from the system
   * @param {{userId: string}} data - Object containing the user ID
   * @returns {Promise<{success: boolean, message: string}>} Delete result
   */
  @MessagePattern('user.remove')
  async remove(data: {userId: string}): Promise<{success: boolean, message: string}> {
    const logMessage = `Delete user request for ID: ${data.userId}`;
    this.fileLogger.log(logMessage, 'user-remove', UserController.name);
    return this.userService.remove(data.userId);
  }

  /**
   * Get user profile
   * @description Gets user profile information
   * @param {{userId: string}} data - Object containing the user ID
   * @returns {Promise<{profile: UserProfileDto}>} User profile data
   */
  @MessagePattern('user.profile.get')
  async getProfile(data: {userId: string}): Promise<{profile: UserProfileDto}> {
    const logMessage = `Get user profile request for ID: ${data.userId}`;
    this.fileLogger.log(logMessage, 'user-profile-get', UserController.name);
    return this.userService.getProfile(data.userId);
  }

  /**
   * Update user profile
   * @description Updates user profile information
   * @param {{userId: string, profileData: Partial<UserProfileDto>}} data - User ID and profile data
   * @returns {Promise<{profile: UserProfileDto}>} Updated profile data
   */
  @MessagePattern('user.profile.update')
  async updateProfile(data: {userId: string, profileData: Partial<UserProfileDto>}): Promise<{profile: UserProfileDto}> {
    const logMessage = `Update user profile request for ID: ${data.userId}`;
    this.fileLogger.log(logMessage, 'user-profile-update', UserController.name);
    return this.userService.updateProfile(data.userId, data.profileData);
  }

  /**
   * Get active sessions for user
   * @description Gets all active sessions for a user
   * @param {{userId: string}} data - Object containing the user ID
   * @returns {Promise<{sessions: SessionDto[]}>} List of active sessions
   */
  @MessagePattern('user.sessions.get')
  async getSessions(data: {userId: string}): Promise<{sessions: SessionDto[]}> {
    const logMessage = `Get user sessions request for ID: ${data.userId}`;
    this.fileLogger.log(logMessage, 'user-sessions-get', UserController.name);
    return this.userService.getSessions(data.userId);
  }

  /**
   * Revoke specific session
   * @description Revokes a specific user session
   * @param {{sessionId: string}} data - Object containing the session ID
   * @returns {Promise<{success: boolean, message: string}>} Revoke result
   */
  @MessagePattern('user.session.revoke')
  async revokeSession(data: {sessionId: string}): Promise<{success: boolean, message: string}> {
    const logMessage = `Revoke session request for ID: ${data.sessionId}`;
    this.fileLogger.log(logMessage, 'user-session-revoke', UserController.name);
    return this.userService.revokeSession(data.sessionId);
  }

  /**
   * Revoke all sessions for user
   * @description Revokes all sessions for a user
   * @param {{userId: string}} data - Object containing the user ID
   * @returns {Promise<{success: boolean, message: string}>} Revoke result
   */
  @MessagePattern('user.sessions.revoke-all')
  async revokeAllSessions(data: {userId: string}): Promise<{success: boolean, message: string}> {
    const logMessage = `Revoke all sessions request for user ID: ${data.userId}`;
    this.fileLogger.log(logMessage, 'user-sessions-revoke-all', UserController.name);
    return this.userService.revokeAllSessions(data.userId);
  }

  /**
   * Get audit logs with optional filtering
   * @description Gets audit logs with optional filtering
   * @param {{startDate?: string, endDate?: string, userId?: string, action?: string}} data - Filter parameters
   * @returns {Promise<{logs: AuditLogDto[], total: number}>} Audit logs
   */
  @MessagePattern('audit.logs.get')
  async getAuditLogs(data: {startDate?: string, endDate?: string, userId?: string, action?: string}): Promise<{logs: AuditLogDto[], total: number}> {
    const logMessage = 'Get audit logs request received';
    this.fileLogger.log(logMessage, 'audit-logs-get', UserController.name);
    return this.userService.getAuditLogs(data);
  }

  /**
   * Get audit logs for specific user
   * @description Gets audit logs for a specific user
   * @param {{userId: string, startDate?: string, endDate?: string}} data - User ID and optional date filters
   * @returns {Promise<{logs: AuditLogDto[], total: number}>} User audit logs
   */
  @MessagePattern('audit.logs.user.get')
  async getUserAuditLogs(data: {userId: string, startDate?: string, endDate?: string}): Promise<{logs: AuditLogDto[], total: number}> {
    const logMessage = `Get audit logs request for user ID: ${data.userId}`;
    this.fileLogger.log(logMessage, 'audit-logs-user-get', UserController.name);
    return this.userService.getUserAuditLogs(data.userId, data.startDate, data.endDate);
  }
}
