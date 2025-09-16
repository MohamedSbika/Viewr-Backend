import { Injectable, Logger, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { Observable, firstValueFrom } from 'rxjs';
import { LoginRequestDto } from '@app/shared';
import { RegisterRequestDto } from '@app/shared';
import { LoginResponseDto } from '@app/shared';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy
  ) {
    this.logger.log('Auth Service initialized');
  }

  getHello(): string {
    return 'Hello from Auth Service!';
  }

  async getHelloFromMicroservice(): Promise<string> {
    this.logger.log('Sending hello request to Auth Microservice');
    try {
      return await firstValueFrom(
        this.authClient.send('auth.hello', {})
      );
    } catch (error) {
      this.logger.error(`Error in getHelloFromMicroservice: ${error.message}`, error.stack);
      throw new HttpException(error.response || {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async login(loginRequest: LoginRequestDto): Promise<LoginResponseDto> {
    try {
      this.logger.log(`Login attempt for user: ${loginRequest.email}`);
      return await firstValueFrom(
        this.authClient.send<LoginResponseDto>('auth.login', loginRequest)
      );
    } catch (error) {
      this.logger.error(`Error during login for ${loginRequest.email}: ${error.message}`, error.stack);
      throw new HttpException(error.response || {
        statusCode: error.statusCode,
        message: error.message
      }, error.status || HttpStatus.PRECONDITION_FAILED);
    }
  }
  async loginOtp(loginRequest: LoginRequestDto & { otp: string }): Promise<LoginResponseDto> {
    try {
      this.logger.log(`Login attempt for user: ${loginRequest.email} with OTP: ${loginRequest.otp}`);
      return await firstValueFrom(
        this.authClient.send<LoginResponseDto>('auth.login-otp', loginRequest)
      );
    } catch (error) {
      this.logger.error(`Error during login for ${loginRequest.email}: ${error.message}`, error.stack);
      throw new HttpException(error.response || {
        statusCode: error.statusCode,
        message: error.message
      }, error.status || HttpStatus.PRECONDITION_FAILED);
    }
  }

  async register(registerRequest: RegisterRequestDto): Promise<any> {
    try {
      this.logger.log(`Registration attempt for user: ${registerRequest.email}`);
      return await firstValueFrom(
        this.authClient.send('auth.register', registerRequest)
      );
    } catch (error) {
      this.logger.error(`Error during registration for ${registerRequest.email}: ${error.message}`, error.stack);
      throw new HttpException(error.response || {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async verifyAccount(data: { userId: string }): Promise<any> {
    try {
      this.logger.log(`Verification request for user ID: ${data.userId}`);
      return await firstValueFrom(
        this.authClient.send('auth.verify', data)
      );
    } catch (error) {
      this.logger.error(`Error during account verification for user ID ${data.userId}: ${error.message}`, error.stack);
      throw new HttpException(error.response || {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async refreshToken(data: { refresh_token: string }): Promise<{ access_token: string }> {
    try {
      this.logger.log('Processing refresh token request');
      return await firstValueFrom(
        this.authClient.send('auth.refresh-token', data)
      );
    } catch (error) {
      this.logger.error(`Error during token refresh: ${error.message}`, error.stack);
      throw new HttpException(error.response || {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.error,
        message: error.message
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
