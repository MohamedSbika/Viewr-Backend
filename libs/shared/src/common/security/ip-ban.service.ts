import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class IpBanService {
  private readonly logger = new Logger(IpBanService.name);
  private readonly bannedIps: Map<string, number> = new Map(); // IP -> ban expiration timestamp
  private readonly ipFailCounter: Map<string, { count: number, timestamp: number }> = new Map();
  
  // Thresholds
  private readonly MAX_FAILURES = 5; // Max failures before ban
  private readonly FAILURE_WINDOW = 60 * 1000; // 1 minute window for failures
  private readonly BAN_DURATION = 24 * 60 * 60 * 1000; // 24 hour ban
  
  constructor() {
    // Clean expired bans every hour
    setInterval(() => this.cleanExpiredBans(), 60 * 60 * 1000);
  }
  
  isBanned(ip: string): boolean {
    const banExpiration = this.bannedIps.get(ip);
    if (!banExpiration) return false;
    
    if (Date.now() > banExpiration) {
      // Ban expired, remove it
      this.bannedIps.delete(ip);
      this.logger.log(`Ban expired for IP: ${ip}`);
      return false;
    }
    
    return true;
  }
  
  recordFailure(ip: string): boolean {
    const now = Date.now();
    const record = this.ipFailCounter.get(ip) || { count: 0, timestamp: now };
    
    // Reset counter if outside the window
    if (now - record.timestamp > this.FAILURE_WINDOW) {
      record.count = 1;
      record.timestamp = now;
    } else {
      record.count++;
    }
    
    this.ipFailCounter.set(ip, record);
    
    // Ban IP if threshold reached
    if (record.count >= this.MAX_FAILURES) {
      this.banIp(ip);
      return true;
    }
    
    return false;
  }
  
  banIp(ip: string): void {
    const banUntil = Date.now() + this.BAN_DURATION;
    this.bannedIps.set(ip, banUntil);
    this.logger.warn(`IP ${ip} has been banned until ${new Date(banUntil).toISOString()}`);
  }
  
  private cleanExpiredBans(): void {
    const now = Date.now();
    for (const [ip, expiration] of this.bannedIps.entries()) {
      if (now > expiration) {
        this.bannedIps.delete(ip);
        this.logger.log(`Removed expired ban for IP: ${ip}`);
      }
    }
  }
}