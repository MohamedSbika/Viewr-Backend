import { Body, Controller, Get, Post, Logger, Inject, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginRequestDto, VerifyOtpRequestDto } from '@app/shared';
import { RegisterRequestDto } from '@app/shared';
import { ApiOperation } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly authService: AuthService,
    @Inject('FileLogger') private readonly fileLogger: any,
  ) {
    this.logger.log('Auth controller initialized');
  }


  @Post('login')
  login(@Body() loginRequest: LoginRequestDto) {
    const logMessage = `Login attempt for user: ${loginRequest.email}`;
    this.fileLogger.log(logMessage, 'auth-login', AuthController.name);
    return this.authService.login(loginRequest);
  }
  
  @Post('login/otp')
  @ApiOperation({ summary: 'Login fonctionnel' })
  loginOtp(@Body() loginRequest: LoginRequestDto, @Headers('x-otp') otp: string) {
    const logMessage = `Login attempt for user: ${loginRequest.email} with OTP: ${otp}`;
    this.fileLogger.log(logMessage, 'auth-login-otp', AuthController.name);
    return this.authService.loginOtp({ ...loginRequest, otp });
  }
  @Post('register')
  register(@Body() registerRequest: RegisterRequestDto) {
    const logMessage = `Registration attempt for user: ${registerRequest.email}`;
    this.fileLogger.log(logMessage, 'auth-register', AuthController.name);
    return this.authService.register(registerRequest);
  }

  @Post('verify')
  verifyAccount(@Body() verifyRequest : VerifyOtpRequestDto) {
    const logMessage = `Verification request for user ID: ${verifyRequest.userId}`;
    this.fileLogger.log(logMessage, 'auth-verify', AuthController.name);
    return this.authService.verifyAccount(verifyRequest);
  }

  @Post('refresh-token')
  refreshToken(@Body() data: { refresh_token: string }) {
    const logMessage = 'Processing refresh token request';
    this.fileLogger.log(logMessage, 'auth.refresh-token', AuthController.name);
    return this.authService.refreshToken(data);
  }
}
