import { Injectable, Logger, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthEndpointsService {
  private readonly logger = new Logger(AuthEndpointsService.name);

  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy
  ) {
    this.logger.log('Auth Endpoints Service initialized');
  }

  // ============= NEW AUTHENTICATION METHODS =============

  /**
   * User logout
   * Message Pattern: 'auth.logout'
   */
  async logout(data: { access_token: string }): Promise<any> {
    try {
      this.logger.log('Processing logout request');
      return await firstValueFrom(
        this.authClient.send('auth.logout', data)
      );
    } catch (error) {
      this.logger.error(`Error during logout: ${error.message}`, error.stack);
      throw new HttpException(error.response || {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Request password reset
   * Message Pattern: 'auth.password-reset-request'
   */
  async requestPasswordReset(data: { email: string }): Promise<any> {
    try {
      this.logger.log(`Password reset request for email: ${data.email}`);
      return await firstValueFrom(
        this.authClient.send('auth.password-reset-request', data)
      );
    } catch (error) {
      this.logger.error(`Error during password reset request for ${data.email}: ${error.message}`, error.stack);
      throw new HttpException(error.response || {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Reset password
   * Message Pattern: 'auth.password-reset'
   */
  async resetPassword(data: { resetToken: string; newPassword: string }): Promise<any> {
    try {
      this.logger.log('Processing password reset');
      return await firstValueFrom(
        this.authClient.send('auth.password-reset', data)
      );
    } catch (error) {
      this.logger.error(`Error during password reset: ${error.message}`, error.stack);
      throw new HttpException(error.response || {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // ============= USER MANAGEMENT METHODS =============

  /**
   * Get all users
   * Message Pattern: 'user.findAll'
   */
  async getAllUsers(): Promise<any> {
    try {
      this.logger.log('Getting all users');
      return await firstValueFrom(
        this.authClient.send('user.findAll', {})
      );
    } catch (error) {
      this.logger.error(`Error getting all users: ${error.message}`, error.stack);
      throw new HttpException(error.response || {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Get user by ID
   * Message Pattern: 'user.findOne'
   */
  async getUserById(userId: string): Promise<any> {
    try {
      this.logger.log(`Getting user by ID: ${userId}`);
      return await firstValueFrom(
        this.authClient.send('user.findOne', { userId })
      );
    } catch (error) {
      this.logger.error(`Error getting user by ID ${userId}: ${error.message}`, error.stack);
      throw new HttpException(error.response || {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Update user
   * Message Pattern: 'user.update'
   */
  async updateUser(userId: string, updateData: any): Promise<any> {
    try {
      this.logger.log(`Updating user: ${userId}`);
      return await firstValueFrom(
        this.authClient.send('user.update', { userId, ...updateData })
      );
    } catch (error) {
      this.logger.error(`Error updating user ${userId}: ${error.message}`, error.stack);
      throw new HttpException(error.response || {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Delete user
   * Message Pattern: 'user.remove'
   */
  async deleteUser(userId: string): Promise<any> {
    try {
      this.logger.log(`Deleting user: ${userId}`);
      return await firstValueFrom(
        this.authClient.send('user.remove', { userId })
      );
    } catch (error) {
      this.logger.error(`Error deleting user ${userId}: ${error.message}`, error.stack);
      throw new HttpException(error.response || {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // ============= ROLE ASSIGNMENT METHODS (New functionality) =============

  /**
   * Assign role to user
   * Message Pattern: 'role.assign-user'
   */
  async assignRoleToUser(data: { userId: string; roleId: string }): Promise<any> {
    try {
      this.logger.log(`Assigning role ${data.roleId} to user ${data.userId}`);
      return await firstValueFrom(
        this.authClient.send('role.assign-user', data)
      );
    } catch (error) {
      this.logger.error(`Error assigning role to user: ${error.message}`, error.stack);
      throw new HttpException(error.response || {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Remove role from user
   * Message Pattern: 'role.remove-user'
   */
  async removeRoleFromUser(data: { userId: string; roleId: string }): Promise<any> {
    try {
      this.logger.log(`Removing role ${data.roleId} from user ${data.userId}`);
      return await firstValueFrom(
        this.authClient.send('role.remove-user', data)
      );
    } catch (error) {
      this.logger.error(`Error removing role from user: ${error.message}`, error.stack);
      throw new HttpException(error.response || {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // ============= FEATURE REMOVAL METHODS (New functionality) =============

  /**
   * Remove feature from role
   * Message Pattern: 'feature.remove'
   */
  async removeFeatureFromRole(data: { featureId: string; roleId: string }): Promise<any> {
    try {
      this.logger.log(`Removing feature ${data.featureId} from role ${data.roleId}`);
      return await firstValueFrom(
        this.authClient.send('feature.remove', data)
      );
    } catch (error) {
      this.logger.error(`Error removing feature from role: ${error.message}`, error.stack);
      throw new HttpException(error.response || {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // ============= PERMISSION REMOVAL METHODS (New functionality) =============

  /**
   * Remove permission from role
   * Message Pattern: 'permission.remove'
   */
  async removePermissionFromRole(data: { permissionId: string; roleId: string }): Promise<any> {
    try {
      this.logger.log(`Removing permission ${data.permissionId} from role ${data.roleId}`);
      return await firstValueFrom(
        this.authClient.send('permission.remove', data)
      );
    } catch (error) {
      this.logger.error(`Error removing permission from role: ${error.message}`, error.stack);
      throw new HttpException(error.response || {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // ============= NOTIFICATION METHODS =============

  /**
   * Store notification
   * Message Pattern: 'notification.store'
   */
  async storeNotification(notificationData: any): Promise<any> {
    try {
      this.logger.log(`Storing notification for establishment: ${notificationData.establishmentId}`);
      return await firstValueFrom(
        this.authClient.send('notification.store', notificationData)
      );
    } catch (error) {
      this.logger.error(`Error storing notification: ${error.message}`, error.stack);
      throw new HttpException(error.response || {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Verify user establishment access
   * Message Pattern: 'notification.verify-user-establishment'
   */
  async verifyUserEstablishment(data: { userId: string; establishmentId: string }): Promise<any> {
    try {
      this.logger.log(`Verifying user ${data.userId} access to establishment ${data.establishmentId}`);
      return await firstValueFrom(
        this.authClient.send('notification.verify-user-establishment', data)
      );
    } catch (error) {
      this.logger.error(`Error verifying user establishment access: ${error.message}`, error.stack);
      throw new HttpException(error.response || {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // ============= PROFILE MANAGEMENT METHODS =============

  /**
   * Get user profile
   * Message Pattern: 'user.profile.get'
   */
  async getUserProfile(userId: string): Promise<any> {
    try {
      this.logger.log(`Getting profile for user: ${userId}`);
      return await firstValueFrom(
        this.authClient.send('user.profile.get', { userId })
      );
    } catch (error) {
      this.logger.error(`Error getting user profile: ${error.message}`, error.stack);
      throw new HttpException(error.response || {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Update user profile
   * Message Pattern: 'user.profile.update'
   */
  async updateUserProfile(userId: string, profileData: any): Promise<any> {
    try {
      this.logger.log(`Updating profile for user: ${userId}`);
      return await firstValueFrom(
        this.authClient.send('user.profile.update', { userId, ...profileData })
      );
    } catch (error) {
      this.logger.error(`Error updating user profile: ${error.message}`, error.stack);
      throw new HttpException(error.response || {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // ============= SESSION MANAGEMENT METHODS =============

  /**
   * Get user sessions
   * Message Pattern: 'user.sessions.get'
   */
  async getUserSessions(userId: string): Promise<any> {
    try {
      this.logger.log(`Getting sessions for user: ${userId}`);
      return await firstValueFrom(
        this.authClient.send('user.sessions.get', { userId })
      );
    } catch (error) {
      this.logger.error(`Error getting user sessions: ${error.message}`, error.stack);
      throw new HttpException(error.response || {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Revoke specific session
   * Message Pattern: 'user.session.revoke'
   */
  async revokeSession(sessionId: string): Promise<any> {
    try {
      this.logger.log(`Revoking session: ${sessionId}`);
      return await firstValueFrom(
        this.authClient.send('user.session.revoke', { sessionId })
      );
    } catch (error) {
      this.logger.error(`Error revoking session: ${error.message}`, error.stack);
      throw new HttpException(error.response || {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Revoke all user sessions
   * Message Pattern: 'user.sessions.revoke-all'
   */
  async revokeAllUserSessions(userId: string): Promise<any> {
    try {
      this.logger.log(`Revoking all sessions for user: ${userId}`);
      return await firstValueFrom(
        this.authClient.send('user.sessions.revoke-all', { userId })
      );
    } catch (error) {
      this.logger.error(`Error revoking all user sessions: ${error.message}`, error.stack);
      throw new HttpException(error.response || {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // ============= AUDIT METHODS =============

  /**
   * Get audit logs
   * Message Pattern: 'audit.logs.get'
   */
  async getAuditLogs(query: any): Promise<any> {
    try {
      this.logger.log('Getting audit logs');
      return await firstValueFrom(
        this.authClient.send('audit.logs.get', query)
      );
    } catch (error) {
      this.logger.error(`Error getting audit logs: ${error.message}`, error.stack);
      throw new HttpException(error.response || {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Get user audit logs
   * Message Pattern: 'audit.logs.user.get'
   */
  async getUserAuditLogs(userId: string, query: any): Promise<any> {
    try {
      this.logger.log(`Getting audit logs for user: ${userId}`);
      return await firstValueFrom(
        this.authClient.send('audit.logs.user.get', { userId, ...query })
      );
    } catch (error) {
      this.logger.error(`Error getting user audit logs: ${error.message}`, error.stack);
      throw new HttpException(error.response || {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
