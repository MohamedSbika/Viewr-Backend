import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { FileLoggerService } from './file-logger.service';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  constructor(private readonly fileLogger: FileLoggerService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { ip, method, originalUrl, body, params, query } = req;
    const userAgent = req.get('user-agent') || '';
    
    // Get application name from the request path or use default
    const appName = this.getApplicationName(originalUrl);
    
    // Generate a unique request ID
    const requestId = this.generateRequestId();
    req['requestId'] = requestId;
    req['requestStartTime'] = Date.now();

    // Log request details
    this.fileLogger.log(
      `[REQUEST ${requestId}] ${method} ${originalUrl} - ${ip} - ${userAgent}\n` +
      `Body: ${JSON.stringify(body)}\n` +
      `Params: ${JSON.stringify(params)}\n` +
      `Query: ${JSON.stringify(query)}`,
      appName,
      'HTTP'
    );

    // Add response logging on finish
    res.on('finish', () => {
      const { statusCode } = res;
      const responseTime = Date.now() - (req['requestStartTime'] || Date.now());
      
      if (statusCode >= 400) {
        this.fileLogger.error(
          `[RESPONSE ${requestId}] ${method} ${originalUrl} - Status: ${statusCode} - ${responseTime}ms`,
          appName,
          'HTTP'
        );
      } else {
        this.fileLogger.log(
          `[RESPONSE ${requestId}] ${method} ${originalUrl} - Status: ${statusCode} - ${responseTime}ms`,
          appName,
          'HTTP'
        );
      }
    });

    next();
  }

  // Extract application name from request URL (e.g., /auth/login -> auth)
  private getApplicationName(url: string): string {
    const path = url.startsWith('/') ? url.substring(1) : url;
    const segments = path.split('/');
    
    if (segments.length > 0 && segments[0]) {
      return segments[0];
    }
    
    return 'api-gateway';
  }

  // Generate a unique request ID
  private generateRequestId(): string {
    return `req-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  }
}