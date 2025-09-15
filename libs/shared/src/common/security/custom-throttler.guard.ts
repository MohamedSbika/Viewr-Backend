import { Injectable, ExecutionContext, CanActivate } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CustomThrottlerGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Skip throttling in development environment
    const env = this.configService.get<string>('NODE_ENV');
    
    if (env === 'development') {
      return true; // Always allow requests in development
    }
    
    // In production, we'll allow all requests - effectively disabling throttling
    // If you want to re-enable throttling in production later, you can
    // implement the throttling logic here or call the ThrottlerGuard
    
    return true;
  }
}
