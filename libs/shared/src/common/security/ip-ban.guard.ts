import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { IpBanService } from './ip-ban.service';

@Injectable()
export class IpBanGuard implements CanActivate {
  private readonly logger = new Logger(IpBanGuard.name);
  
  constructor(private readonly ipBanService: IpBanService) {}
  
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const ip = request.ip || request.connection.remoteAddress;
    
    if (this.ipBanService.isBanned(ip)) {
      this.logger.warn(`Blocked request from banned IP: ${ip}`);
      throw new HttpException('Your IP address has been temporarily banned due to excessive requests', HttpStatus.TOO_MANY_REQUESTS);
    }
    
    return true;
  }
}