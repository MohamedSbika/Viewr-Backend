import { Injectable, HttpStatus, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as argon2 from 'argon2';
import { LoginRequestDto, VerifyOtpRequestDto } from '@app/shared';
import { LoginResponseDto } from './dto/login-response.dto';
import { RegisterRequestDto } from '@app/shared';
import { UserAuth, RoleAuth, UserProfileAuth } from '@app/shared';
import { RedisService } from '@app/shared';
import { REDIS_KEYS, buildRedisKey } from '@app/shared';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { EmailService } from '@app/shared';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(UserAuth)
    private readonly userRepository: Repository<UserAuth>,
    @InjectRepository(UserProfileAuth)
    private readonly userProfileRepository: Repository<UserProfileAuth>,
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
  ) {}

  /**
   * Simple test method to verify service functionality
   * @returns {string} A greeting message
   */
  getHello(): string {
    return 'Hello from AuthService!';
  }

  /**
   * Generates an access token for a user
   * @param {User} user - The user entity
   * @param {string} role - User role title
   * @returns {Promise<string>} Generated access token
   */
  private async  generateAccessToken(user: UserAuth, role: string): Promise<string> {
    const accessPayload = {
      sub: user.id,
      email: user.email,
      role: role,
      iat: Math.floor(Date.now() / 1000),
    };

    return this.jwtService.sign(accessPayload);
  }

  /**
   * Generates a refresh token for a user
   * @param {User} user - The user entity
   * @returns {Promise<string>} Generated refresh token
   */
  private async generateRefreshToken(user: UserAuth, role: string): Promise<string> {
    const refreshTokenId = uuidv4();
    const refreshPayload = {
      sub: user.id,
      email: user.email,
      role: role,
      jti: refreshTokenId,
      iat: Math.floor(Date.now() / 1000),
    };

    // Get expiry time in seconds from config
    const expirySeconds = parseInt(this.configService.get('JWT_REFRESH_EXPIRY', '1209600'));

    const refreshToken = this.jwtService.sign(refreshPayload, {
      expiresIn: expirySeconds,
    });

    // Store token in Redis using the key pattern from constants
    const redisKey = buildRedisKey(REDIS_KEYS.AUTH.REFRESH_TOKEN, user.email, refreshTokenId);
    try {
      await this.redisService.set(redisKey, refreshToken, expirySeconds);
      this.logger.log(`Refresh token stored with key: ${redisKey}`);
    } catch (error) {
      this.logger.error(`Failed to store refresh token: ${error.message}`, error.stack);
    }

    return refreshToken;
  }
  async connectWithRefreshToken(token: string): Promise<any> {
   const decoded = this.jwtService.verify(token);
   const { sub: userId, email, jti: tokenId ,expiresIn } = decoded;
    const redisKey = buildRedisKey(REDIS_KEYS.AUTH.REFRESH_TOKEN, email, tokenId);
    const storedToken = await this.redisService.get(redisKey);
  
    if (!storedToken) {
      throw new RpcException({
        statusCode: HttpStatus.UNAUTHORIZED,
        error: 'Unauthorized',
        message: 'Invalid refresh token'
      });
    }
    const currentTime = Math.floor(Date.now() / 1000);
    if (currentTime > expiresIn) {
      throw new RpcException({
        statusCode: HttpStatus.UNAUTHORIZED,
        error: 'Unauthorized',
        message: 'Refresh token expired'
      });
    }
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['roles', 'roles.roleFeaturePermissions', 'roles.roleFeaturePermissions.feature']
    });
    if (!user) {
      throw new RpcException({
        statusCode: HttpStatus.NOT_FOUND,
        error: 'Not Found',
        message: 'User not found'
      });
    }
    const userRole = user.roles?.[0];
    const accessToken = await this.generateAccessToken(user, userRole?.title || 'User');
    return {
      access_token: accessToken,
    };
  
  }
  

  /**
   * Generates a User token for a user
   * @param {User} user - The user entity
   * @returns {Promise<string>} Generated User token
   */
  private async generateUserToken(user: UserAuth,features:any): Promise<string> {
    const userPayload = {

      sub: user.id,
      email:user.email,
      features: features,
      iat: Math.floor(Date.now() / 1000),
    };
    
    const userToken = this.jwtService.sign(userPayload, {
      expiresIn: parseInt(this.configService.get('JWT_REFRESH_EXPIRY', '1209600')),
    });


    return userToken;
  }

async register(registerRequest: RegisterRequestDto): Promise<any> {
  this.logger.log(`🏗️  [MICROSERVICE] Registration started for: ${registerRequest.email}`);
  
  const { email, password, phone_number, profile } = registerRequest;

  this.logger.log(`🔍 [MICROSERVICE] Checking existing user...`);
  const existingUser = await this.userRepository.findOne({ where: { email } });
  if (existingUser) {
    this.logger.log(`⚠️  [MICROSERVICE] User already exists`);
    throw new RpcException({
      statusCode: HttpStatus.CONFLICT,
      error: 'Conflict',
      message: 'User with this email already exists'
    });
  }

  this.logger.log(`🔐 [MICROSERVICE] Hashing password...`);
  const hashedPassword = await this.hashPassword(password);

  this.logger.log(`🗄️  [MICROSERVICE] Starting database transaction...`);
  const queryRunner = this.userRepository.manager.connection.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();
  
  try {
    this.logger.log(`👤 [MICROSERVICE] Creating user profile...`);
    const userProfile = this.userProfileRepository.create({
      FirstName: profile.FirstName,
      LastName: profile.LastName,
      address: profile.address,
      gender: profile.gender,
      CIN: profile.CIN,
      DOB: profile.DOB
    });
    
    await queryRunner.manager.save(userProfile);
    this.logger.log(`✅ [MICROSERVICE] Profile saved with ID: ${userProfile.id}`);
    
    this.logger.log(`🧑 [MICROSERVICE] Creating user...`);
    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      phone_number,
      profile: userProfile,
    });
    
    await queryRunner.manager.save(user);
    this.logger.log(`✅ [MICROSERVICE] User saved with ID: ${user.id}`);
    
    this.logger.log(`🔍 [MICROSERVICE] Looking for default role...`);
    const defaultRole = await queryRunner.manager.findOne(RoleAuth, { 
      where: { title: 'User' } 
    });
    
    if (defaultRole) {
      this.logger.log(`👥 [MICROSERVICE] Assigning default role...`);
      user.roles = [defaultRole];
      await queryRunner.manager.save(user);
      this.logger.log(`✅ [MICROSERVICE] Role assigned`);
    } else {
      this.logger.warn(`⚠️  [MICROSERVICE] Default role 'User' not found!`);
    }
    
    this.logger.log(`💾 [MICROSERVICE] Committing transaction...`);
    await queryRunner.commitTransaction();
    
    this.logger.log(`🎉 [MICROSERVICE] Registration completed successfully`);
    return {
      success: true,
      message: 'User registered successfully',
      user: {
        id: user.id,
        email: user.email
      }
    };
  } catch (error) {
    this.logger.error(`❌ [MICROSERVICE] Transaction error: ${error.message}`, error.stack);
    await queryRunner.rollbackTransaction();
    throw new RpcException({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      error: 'Internal Server Error',
      message: error.message || 'Error registering user'
    });
  } finally {
    this.logger.log(`🔒 [MICROSERVICE] Releasing query runner...`);
    await queryRunner.release();
  }
}

async verifyAccount(verifyRequest: VerifyOtpRequestDto): Promise<any> {
  const user = await this.userRepository.findOne({ where: { id: verifyRequest.userId } });
    
    if (!user) {
      throw new RpcException({
        statusCode: HttpStatus.NOT_FOUND,
        error: 'Not Found',
        message: 'User not found'
      });
    }
    
    user.is_verified = true;
    await this.userRepository.save(user);
    
    return {
      success: true,
      message: 'Account verified successfully'
    };
  }



async login(loginRequest: LoginRequestDto): Promise<LoginResponseDto> {
  const { email, password } = loginRequest;

  const user = await this.userRepository.findOne({
    where: { email },
    relations: [
      'roles',
      'roles.roleFeaturePermissions',
      'roles.roleFeaturePermissions.feature',
      'roles.roleFeaturePermissions.permission',
      'profile',
      'establishment',
    ],
  });

  if (!user || !(await this.verifyPassword(user.password, password))) {
    throw new RpcException({
      statusCode: HttpStatus.UNAUTHORIZED,
      message: 'Invalid email or password',
    });
  }

  if (!user.is_verified) {
    throw new RpcException({
      statusCode: HttpStatus.UNAUTHORIZED,
      message: 'Please verify your account before logging in',
    });
  }

  // ✅ Générer un OTP pour permettre le login via /login-otp
  await this.generateOtp(email);

  // ... ensuite, génération des tokens comme d’habitude
  const userRole = user.roles?.[0];
  const role = userRole?.title || 'User';

  const permissions: { [key: string]: string[] } = {};
  userRole?.roleFeaturePermissions.forEach(rfp => {
    if (rfp.feature?.isActive && rfp.feature?.name) {
      const featureName = rfp.feature.name;
      const permissionName = rfp.permission?.action || '';
      if (!permissions[featureName]) permissions[featureName] = [];
      permissions[featureName].push(permissionName);
    }
  });

  const accessToken = await this.generateAccessToken(user, role);
  const refreshToken = await this.generateRefreshToken(user, role);
  const userToken = await this.generateUserToken(user, permissions);

  return {
    access_token: accessToken,
    refresh_token: refreshToken,
    user_token: userToken,
    user: {
      id: user.id,
      fullname: `${user.profile.FirstName} ${user.profile.LastName}`,
      email: user.email,
      role: role,
            // establishment: user.establishment ? { id: user.establishment.id, name: user.establishment.name } : undefined

    },
  };
}
  /**
   * Hashes a password using Argon2id with an additional paraphrase secret
   * @param {string} password - Plain text password to hash
   * @returns {Promise<string>} Hashed password
   * @private
   */
  private async hashPassword(password: string): Promise<string> {
    const paraphrase = this.configService.get<string>('ARGON2_PARAPHRASE') || '';
    
    return await argon2.hash(password, {
      type: argon2.argon2id, 
      memoryCost: 2**16,
      timeCost: 3,
      parallelism: 2,
      secret: Buffer.from(paraphrase),
    });
  }

  /**
   * Verifies a password against a hashed value using Argon2
   * @param {string} hashedPassword - The hashed password to compare against
   * @param {string} plainPassword - The plain text password to verify
   * @returns {Promise<boolean>} True if password matches, false otherwise
   * @private
   */
  private async verifyPassword(hashedPassword: string, plainPassword: string): Promise<boolean> {
    const paraphrase = this.configService.get<string>('ARGON2_PARAPHRASE') || '';
    
    return await argon2.verify(hashedPassword, plainPassword, {
      secret: Buffer.from(paraphrase),
    });
  }
  /**
   * Checks if OTP is required for the user (i.e., if an OTP exists in Redis for this email)
   * @param {string} email
   * @returns {Promise<boolean>}
   */
  async isOtpRequired(email: string): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: { email },
    });
    if (!user) {
      return false;
    }
    const otp = await this.generateOtp(email);
    const nodeEnv = this.configService.get<string>('NODE_ENV');
    if (nodeEnv !== 'development') {
      // Send OTP email only if not in development
      await this.emailService.sendMail({
        to: email,
        subject: 'Your OTP Code',
        html: `<p>Your OTP code is: <b>${otp}</b></p>`,
        text: `Your OTP code is: ${otp}`,
      });
    } else {
      this.logger.log(`[DEV MODE] OTP for ${email}: ${otp}`);
    }
    return true;
  }

  /**
   * Generates a 6-digit OTP, stores it in Redis, and logs it to the console
   * @param {string} email
   * @returns {Promise<string>} The generated OTP
   */
  private async generateOtp(email: string): Promise<string> {
    const otpKey = buildRedisKey(REDIS_KEYS.AUTH.OTP, email);
    this.logger.log(`[OTP DEBUG] OTP key to use: ${otpKey}`);
    // Log value before deletion
    const beforeDel = await this.redisService.get(otpKey);
    this.logger.log(`[OTP DEBUG] Value before deletion: ${beforeDel}`);
    // Remove any old OTP for this user
    await this.redisService.del(otpKey);
    const afterDel = await this.redisService.get(otpKey);
    this.logger.log(`[OTP DEBUG] Value after deletion: ${afterDel}`);
    // Generate a 6-digit random OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    // Set expiry to 5 minutes (300 seconds)
    await this.redisService.set(otpKey, otp, 300);
    // Log OTP to console (for now)
    this.logger.log(`[OTP DEBUG] Generated OTP for ${email}: ${otp}`);
    const afterSet = await this.redisService.get(otpKey);
    this.logger.log(`[OTP DEBUG] Value after set: ${afterSet}`);
    return otp;
  }

  /**
   * Verifies the OTP for a user
   * @param {string} email
   * @param {string} otp
   * @returns {Promise<boolean>}
   */
  async verifyOtp(email: string, otp: string): Promise<boolean> {
    const otpKey = buildRedisKey(REDIS_KEYS.AUTH.OTP, email);
    const storedOtp = await this.redisService.get(otpKey);
    console.log( storedOtp , " dada " , otp)
    return storedOtp === otp;
  }

  /**
   * Removes the OTP for a user from Redis
   * @param {string} email
   * @returns {Promise<void>}
   */
  async removeOtp(email: string): Promise<void> {
    const otpKey = buildRedisKey(REDIS_KEYS.AUTH.OTP, email);
    await this.redisService.del(otpKey);
  }

  /**
   * Logout user and invalidate tokens
   * @param {string} accessToken - The access token to invalidate
   * @returns {Promise<{success: boolean, message: string}>} Logout result
   */
  async logout(accessToken: string): Promise<{success: boolean, message: string}> {
    try {
      const decoded = this.jwtService.verify(accessToken);
      const { sub: userId, email, jti } = decoded;

      // Add token to blacklist in Redis (store until expiry)
      const blacklistKey = buildRedisKey(REDIS_KEYS.AUTH.BLACKLIST, accessToken);
      const expirySeconds = parseInt(this.configService.get('JWT_ACCESS_EXPIRY', '900')); // 15 minutes default
      await this.redisService.set(blacklistKey, 'true', expirySeconds);

      // Optionally remove all refresh tokens for the user
      const refreshTokenPattern = buildRedisKey(REDIS_KEYS.AUTH.REFRESH_TOKEN, email, '*');
      const refreshTokenKeys = await this.redisService.scanPattern(refreshTokenPattern);
      if (refreshTokenKeys && refreshTokenKeys.length > 0) {
        await this.redisService.delMultiple(refreshTokenKeys);
      }

      this.logger.log(`User ${email} logged out successfully`);
      return {
        success: true,
        message: 'Logged out successfully'
      };
    } catch (error) {
      throw new RpcException({
        statusCode: HttpStatus.UNAUTHORIZED,
        error: 'Unauthorized',
        message: 'Invalid access token'
      });
    }
  }

  /**
   * Request password reset - generates reset token and sends email
   * @param {string} email - User email
   * @returns {Promise<{success: boolean, message: string}>} Password reset request result
   */
  async requestPasswordReset(email: string): Promise<{success: boolean, message: string}> {
    const user = await this.userRepository.findOne({ where: { email } });
    
    if (!user) {
      // Don't reveal if email exists or not for security
      return {
        success: true,
        message: 'If the email exists, a reset link has been sent'
      };
    }

    // Generate reset token
    const resetToken = uuidv4();
    const resetKey = buildRedisKey(REDIS_KEYS.AUTH.PASSWORD_RESET, email, resetToken);
    
    // Store reset token in Redis with 1 hour expiry
    await this.redisService.set(resetKey, user.id, 3600);

    // Send email with reset link
    const nodeEnv = this.configService.get<string>('NODE_ENV');
    const resetLink = `${this.configService.get('FRONTEND_URL')}/reset-password?token=${resetToken}&email=${email}`;
    
    if (nodeEnv !== 'development') {
      await this.emailService.sendMail({
        to: email,
        subject: 'Password Reset Request',
        html: `
          <h2>Password Reset Request</h2>
          <p>You have requested to reset your password. Click the link below to proceed:</p>
          <a href="${resetLink}">Reset Password</a>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this, please ignore this email.</p>
        `,
        text: `Password reset link: ${resetLink}`
      });
    } else {
      this.logger.log(`[DEV MODE] Password reset link for ${email}: ${resetLink}`);
    }

    return {
      success: true,
      message: 'If the email exists, a reset link has been sent'
    };
  }

  /**
   * Reset password using reset token
   * @param {string} resetToken - The reset token
   * @param {string} newPassword - The new password
   * @returns {Promise<{success: boolean, message: string}>} Password reset result
   */
  async resetPassword(resetToken: string, newPassword: string, email: string): Promise<{success: boolean, message: string}> {
    const resetKey = buildRedisKey(REDIS_KEYS.AUTH.PASSWORD_RESET, email, resetToken);
    const userId = await this.redisService.get(resetKey);

    if (!userId) {
      throw new RpcException({
        statusCode: HttpStatus.BAD_REQUEST,
        error: 'Bad Request',
        message: 'Invalid or expired reset token'
      });
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new RpcException({
        statusCode: HttpStatus.NOT_FOUND,
        error: 'Not Found',
        message: 'User not found'
      });
    }

    // Hash new password
    const hashedPassword = await this.hashPassword(newPassword);
    user.password = hashedPassword;
    await this.userRepository.save(user);

    // Remove reset token
    await this.redisService.del(resetKey);

    // Invalidate all refresh tokens for the user
    const refreshTokenPattern = buildRedisKey(REDIS_KEYS.AUTH.REFRESH_TOKEN, email, '*');
    const refreshTokenKeys = await this.redisService.scanPattern(refreshTokenPattern);
    if (refreshTokenKeys && refreshTokenKeys.length > 0) {
      await this.redisService.delMultiple(refreshTokenKeys);
    }

    this.logger.log(`Password reset successful for user ${email}`);
    return {
      success: true,
      message: 'Password reset successfully'
    };
  }

}