import { Controller, HttpStatus, Logger, PreconditionFailedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern, RpcException } from '@nestjs/microservices';
import { LoginRequestDto } from './dto/login-request.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { RegisterRequestDto, VerifyOtpRequestDto } from '@app/shared';
import { LogoutRequestDto } from './dto/logout-response.dto';
import { PasswordResetRequestDto } from './dto/password-reset-request.dto';
import { PasswordResetDto } from './dto/password-reset.dto';
import { FileLoggerService } from './logging/file-logger.service';

@Controller()
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly fileLogger: FileLoggerService
  ) { }

  /**
   * Simple hello world test endpoint for the auth service
   * @description A basic test endpoint to verify that the auth microservice is running and responding
   * @param {any} data - Any input data (not used)
   * @returns {string} Simple greeting message
   */
  @MessagePattern('auth.hello')
  getHello(data: any): string {
    const logMessage = 'Received hello request';
    this.fileLogger.log(logMessage, 'auth-hello', AuthController.name);
    return this.authService.getHello();
  }

  /**
   * Authenticates a user and generates access/refresh tokens
   * @description Validates user credentials and returns tokens if authentication is successful
   * @param {LoginRequestDto} loginRequest - Login credentials containing email and password
   * @returns {Promise<LoginResponseDto>} Login result with access token, refresh token, and user information
   */
  @MessagePattern('auth.login')
  async handleLogin(loginRequest: LoginRequestDto): Promise<LoginResponseDto> {
    const logMessage = `Login attempt for user: ${loginRequest.email}`;
    this.fileLogger.log(logMessage, 'auth-login', AuthController.name);

    // Appel à la vraie fonction login qui fait toute la logique
    return this.authService.login(loginRequest);
  }

  /**
   * Authenticates a user using OTP and generates tokens
   * @description Validates user credentials and OTP, returns tokens if successful, removes OTP from DB
   * @param {{ email: string, password: string, otp: string }} loginOtpRequest - Login credentials + OTP
   * @returns {Promise<LoginResponseDto>} Login result with tokens and user info
   */
  @MessagePattern('auth.login-otp')
  async loginWithOtp(
    loginOtpRequest: LoginRequestDto & { otp: string }
  ): Promise<LoginResponseDto> {
    const logMessage = `OTP login attempt for user: ${loginOtpRequest.email}`;
    this.fileLogger.log(logMessage, 'auth-login-otp', AuthController.name);
    // Verify OTP
    const isValidOtp = await this.authService.verifyOtp(
      loginOtpRequest.email,
      loginOtpRequest.otp
    );
    if (!isValidOtp) {
      throw new RpcException({
        statusCode: HttpStatus.PRECONDITION_FAILED,
        message: 'OTP INVALID'
      });
    }
    // Remove OTP from DB
    await this.authService.removeOtp(loginOtpRequest.email);
    // Proceed with normal login
    return this.authService.login(loginOtpRequest);
  }

  /**
   * Registers a new user in the system
   * @description Creates a new user account with profile information and assigns default role
   * @param {RegisterRequestDto} registerRequest - The registration data including email, password and profile details
   * @returns {Promise<{success: boolean, message: string, user: {id: string, email: string}}>} Registration result with user information
   */
  @MessagePattern('auth.register')
  async register(registerRequest: RegisterRequestDto): Promise<any> {
    const logMessage = `Registration attempt for user: ${registerRequest.email}`;
    this.fileLogger.log(logMessage, 'auth-register', AuthController.name);
    return this.authService.register(registerRequest);
  }

  /**
   * Verifies a user account by setting is_verified to true
   * @description Updates a user's verification status, allowing them to log in
   * @param {{userId: string}} data - Object containing the ID of the user to verify
   * @returns {Promise<{success: boolean, message: string}>} Verification result
   */
  @MessagePattern('auth.verify')
  async verifyAccount(verifyRequest: VerifyOtpRequestDto): Promise<any> {
    const logMessage = `Verification request for user ID: ${verifyRequest.userId}`;
    this.fileLogger.log(logMessage, 'auth-verify', AuthController.name);
    return this.authService.verifyAccount(verifyRequest);
  }

  /**
   * Refreshes an access token using a valid refresh token
   * @description Generates a new access token when provided with a valid refresh token
   * @param {{refresh_token: string}} data - Object containing the refresh token
   * @returns {Promise<{access_token: string}>} New access token
   */

  @MessagePattern('auth.refresh-token')
  async refreshToken(data: { refresh_token: string }): Promise<{ access_token: string }> {
    const logMessage = `Refresh token attempt received`;
    this.fileLogger.log(logMessage, 'auth-refresh-token', AuthController.name);
    console.log('Refresh token data:', data);
    return this.authService.connectWithRefreshToken(data.refresh_token);
  }

  /**
   * Logout user and invalidate tokens
   * @description Invalidates access token and removes refresh tokens for the user
   * @param {LogoutRequestDto} logoutRequest - Object containing the access token to invalidate
   * @returns {Promise<{success: boolean, message: string}>} Logout result
   */
  @MessagePattern('auth.logout')
  async logout(logoutRequest: LogoutRequestDto): Promise<{ success: boolean, message: string }> {
    const logMessage = `Logout attempt received`;
    this.fileLogger.log(logMessage, 'auth-logout', AuthController.name);
    return this.authService.logout(logoutRequest.access_token);
  }

  /**
   * Request password reset
   * @description Generates a password reset token and sends it via email
   * @param {PasswordResetRequestDto} resetRequest - Object containing the email to send reset link to
   * @returns {Promise<{success: boolean, message: string}>} Password reset request result
   */
  @MessagePattern('auth.password-reset-request')
  async requestPasswordReset(resetRequest: PasswordResetRequestDto): Promise<{ success: boolean, message: string }> {
    const logMessage = `Password reset request for email: ${resetRequest.email}`;
    this.fileLogger.log(logMessage, 'auth-password-reset-request', AuthController.name);
    return this.authService.requestPasswordReset(resetRequest.email);
  }

  /**
   * Reset password with token
   * @description Resets user password using the provided reset token
   * @param {PasswordResetDto & {email: string}} resetData - Object containing reset token, new password, and email
   * @returns {Promise<{success: boolean, message: string}>} Password reset result
   */
  @MessagePattern('auth.password-reset')
  async resetPassword(resetData: PasswordResetDto & { email: string }): Promise<{ success: boolean, message: string }> {
    const logMessage = `Password reset attempt for email: ${resetData.email}`;
    this.fileLogger.log(logMessage, 'auth-password-reset', AuthController.name);
    return this.authService.resetPassword(resetData.resetToken, resetData.newPassword, resetData.email);
  }

}