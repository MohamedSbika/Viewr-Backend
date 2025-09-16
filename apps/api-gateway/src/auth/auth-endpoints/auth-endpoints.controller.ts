import { Body, Controller, Get, Post, Put, Delete, Param, Logger, Inject, Headers, Query } from '@nestjs/common';
import { AuthEndpointsService } from './auth-endpoints.service';
import { FileLoggerService } from '@app/shared';

@Controller('auth')
export class AuthEndpointsController {
  private readonly logger = new Logger(AuthEndpointsController.name);

  constructor(
    private readonly authEndpointsService: AuthEndpointsService,
    @Inject('FileLogger') private readonly fileLogger: FileLoggerService,
  ) {
    this.logger.log('Auth Endpoints Controller initialized');
  }

  // ============= NEW AUTHENTICATION ENDPOINTS =============

  /**
   * User logout endpoint
   * @param data - Object containing access token
   * @returns Logout confirmation
   */
  @Post('logout')
  async logout(@Body() data: { access_token: string }) {
    const logMessage = 'Processing logout request';
    this.fileLogger.log(logMessage, 'auth-logout', AuthEndpointsController.name);
    return this.authEndpointsService.logout(data);
  }

  /**
   * Password reset request endpoint
   * @param data - Object containing email
   * @returns Password reset confirmation
   */
  @Post('password/reset-request')
  async requestPasswordReset(@Body() data: { email: string }) {
    const logMessage = `Password reset request for email: ${data.email}`;
    this.fileLogger.log(logMessage, 'auth-password-reset-request', AuthEndpointsController.name);
    return this.authEndpointsService.requestPasswordReset(data);
  }

  /**
   * Password reset endpoint
   * @param data - Object containing reset token and new password
   * @returns Password reset confirmation
   */
  @Post('password/reset')
  async resetPassword(@Body() data: { resetToken: string; newPassword: string }) {
    const logMessage = 'Processing password reset';
    this.fileLogger.log(logMessage, 'auth-password-reset', AuthEndpointsController.name);
    return this.authEndpointsService.resetPassword(data);
  }

  // ============= USER MANAGEMENT ENDPOINTS =============

  /**
   * Get all users
   * @returns List of all users
   */
  @Get('users')
  async getAllUsers() {
    const logMessage = 'Getting all users';
    this.fileLogger.log(logMessage, 'auth-users-get-all', AuthEndpointsController.name);
    return this.authEndpointsService.getAllUsers();
  }

  /**
   * Get user by ID
   * @param userId - User ID
   * @returns User details
   */
  @Get('users/:userId')
  async getUserById(@Param('userId') userId: string) {
    const logMessage = `Getting user by ID: ${userId}`;
    this.fileLogger.log(logMessage, 'auth-users-get-by-id', AuthEndpointsController.name);
    return this.authEndpointsService.getUserById(userId);
  }

  /**
   * Update user
   * @param userId - User ID
   * @param updateData - User update data
   * @returns Updated user
   */
  @Put('users/:userId')
  async updateUser(@Param('userId') userId: string, @Body() updateData: any) {
    const logMessage = `Updating user: ${userId}`;
    this.fileLogger.log(logMessage, 'auth-users-update', AuthEndpointsController.name);
    return this.authEndpointsService.updateUser(userId, updateData);
  }

  /**
   * Delete user
   * @param userId - User ID
   * @returns Deletion confirmation
   */
  @Delete('users/:userId')
  async deleteUser(@Param('userId') userId: string) {
    const logMessage = `Deleting user: ${userId}`;
    this.fileLogger.log(logMessage, 'auth-users-delete', AuthEndpointsController.name);
    return this.authEndpointsService.deleteUser(userId);
  }

  // ============= ROLE ASSIGNMENT ENDPOINTS (New functionality) =============

  /**
   * Assign role to user
   * @param data - Object containing userId and roleId
   * @returns Assignment confirmation
   */
  @Post('roles/assign')
  async assignRoleToUser(@Body() data: { userId: string; roleId: string }) {
    const logMessage = `Assigning role ${data.roleId} to user ${data.userId}`;
    this.fileLogger.log(logMessage, 'role-assign-user', AuthEndpointsController.name);
    return this.authEndpointsService.assignRoleToUser(data);
  }

  /**
   * Remove role from user
   * @param data - Object containing userId and roleId
   * @returns Removal confirmation
   */
  @Post('roles/remove')
  async removeRoleFromUser(@Body() data: { userId: string; roleId: string }) {
    const logMessage = `Removing role ${data.roleId} from user ${data.userId}`;
    this.fileLogger.log(logMessage, 'role-remove-user', AuthEndpointsController.name);
    return this.authEndpointsService.removeRoleFromUser(data);
  }

  // ============= FEATURE ASSIGNMENT ENDPOINTS (New functionality) =============

  /**
   * Remove feature from role
   * @param data - Object containing featureId and roleId
   * @returns Removal confirmation
   */
  @Post('features/remove')
  async removeFeatureFromRole(@Body() data: { featureId: string; roleId: string }) {
    const logMessage = `Removing feature ${data.featureId} from role ${data.roleId}`;
    this.fileLogger.log(logMessage, 'feature-remove', AuthEndpointsController.name);
    return this.authEndpointsService.removeFeatureFromRole(data);
  }

  // ============= PERMISSION REMOVAL ENDPOINTS (New functionality) =============

  /**
   * Remove permission from role
   * @param data - Object containing permissionId and roleId
   * @returns Removal confirmation
   */
  @Post('permissions/remove')
  async removePermissionFromRole(@Body() data: { permissionId: string; roleId: string }) {
    const logMessage = `Removing permission ${data.permissionId} from role ${data.roleId}`;
    this.fileLogger.log(logMessage, 'permission-remove', AuthEndpointsController.name);
    return this.authEndpointsService.removePermissionFromRole(data);
  }

  // ============= NOTIFICATION ENDPOINTS =============

  /**
   * Store notification
   * @param notificationData - Notification data
   * @returns Stored notification
   */
  @Post('notifications')
  async storeNotification(@Body() notificationData: any) {
    const logMessage = `Storing notification for establishment: ${notificationData.establishmentId}`;
    this.fileLogger.log(logMessage, 'notification-store', AuthEndpointsController.name);
    return this.authEndpointsService.storeNotification(notificationData);
  }

  /**
   * Verify user establishment access
   * @param data - Object containing userId and establishmentId
   * @returns Verification result
   */
  @Post('notifications/verify-user-establishment')
  async verifyUserEstablishment(@Body() data: { userId: string; establishmentId: string }) {
    const logMessage = `Verifying user ${data.userId} access to establishment ${data.establishmentId}`;
    this.fileLogger.log(logMessage, 'notification-verify', AuthEndpointsController.name);
    return this.authEndpointsService.verifyUserEstablishment(data);
  }

  // ============= PROFILE MANAGEMENT ENDPOINTS =============

  /**
   * Get user profile
   * @param userId - User ID
   * @returns User profile
   */
  @Get('profile/:userId')
  async getUserProfile(@Param('userId') userId: string) {
    const logMessage = `Getting profile for user: ${userId}`;
    this.fileLogger.log(logMessage, 'auth-profile-get', AuthEndpointsController.name);
    return this.authEndpointsService.getUserProfile(userId);
  }

  /**
   * Update user profile
   * @param userId - User ID
   * @param profileData - Profile update data
   * @returns Updated profile
   */
  @Put('profile/:userId')
  async updateUserProfile(@Param('userId') userId: string, @Body() profileData: any) {
    const logMessage = `Updating profile for user: ${userId}`;
    this.fileLogger.log(logMessage, 'auth-profile-update', AuthEndpointsController.name);
    return this.authEndpointsService.updateUserProfile(userId, profileData);
  }

  // ============= SESSION MANAGEMENT ENDPOINTS =============

  /**
   * Get active sessions for user
   * @param userId - User ID
   * @returns List of active sessions
   */
  @Get('sessions/:userId')
  async getUserSessions(@Param('userId') userId: string) {
    const logMessage = `Getting sessions for user: ${userId}`;
    this.fileLogger.log(logMessage, 'auth-sessions-get', AuthEndpointsController.name);
    return this.authEndpointsService.getUserSessions(userId);
  }

  /**
   * Revoke specific session
   * @param sessionId - Session ID
   * @returns Revocation confirmation
   */
  @Delete('sessions/:sessionId')
  async revokeSession(@Param('sessionId') sessionId: string) {
    const logMessage = `Revoking session: ${sessionId}`;
    this.fileLogger.log(logMessage, 'auth-session-revoke', AuthEndpointsController.name);
    return this.authEndpointsService.revokeSession(sessionId);
  }

  /**
   * Revoke all sessions for user
   * @param userId - User ID
   * @returns Revocation confirmation
   */
  @Delete('sessions/user/:userId/all')
  async revokeAllUserSessions(@Param('userId') userId: string) {
    const logMessage = `Revoking all sessions for user: ${userId}`;
    this.fileLogger.log(logMessage, 'auth-sessions-revoke-all', AuthEndpointsController.name);
    return this.authEndpointsService.revokeAllUserSessions(userId);
  }

  // ============= AUDIT ENDPOINTS =============

  /**
   * Get audit logs
   * @param query - Query parameters for filtering
   * @returns Audit logs
   */
  @Get('audit')
  async getAuditLogs(@Query() query: any) {
    const logMessage = 'Getting audit logs';
    this.fileLogger.log(logMessage, 'auth-audit-get', AuthEndpointsController.name);
    return this.authEndpointsService.getAuditLogs(query);
  }

  /**
   * Get audit logs for specific user
   * @param userId - User ID
   * @param query - Query parameters for filtering
   * @returns User audit logs
   */
  @Get('audit/user/:userId')
  async getUserAuditLogs(@Param('userId') userId: string, @Query() query: any) {
    const logMessage = `Getting audit logs for user: ${userId}`;
    this.fileLogger.log(logMessage, 'auth-audit-user-get', AuthEndpointsController.name);
    return this.authEndpointsService.getUserAuditLogs(userId, query);
  }
}
