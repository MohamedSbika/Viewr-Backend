import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { FileLoggerService } from './file-logger.service';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  constructor(private readonly fileLogger: FileLoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    if (context.getType() === 'http') {
      return this.logHttpCall(context, next);
    } else {
      return this.logRpcCall(context, next);
    }
  }

  private logHttpCall(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;
    const requestId = request['requestId'] || this.generateRequestId();
    const appName = this.getApplicationName(url);
    
    const controller = context.getClass().name;
    const handler = context.getHandler().name;
    
    // Request is already logged by middleware, this adds additional controller context
    this.fileLogger.log(
      `[REQUEST ${requestId}] Handler: ${controller}.${handler}()`,
      appName,
      'Controller'
    );

    const now = Date.now();
    return next.handle().pipe(
      tap({
        next: (data) => {
          const responseTime = Date.now() - now;
          this.fileLogger.log(
            `[RESPONSE ${requestId}] ${method} ${url} - Handler: ${controller}.${handler}() - ${responseTime}ms\nResponse: ${this.formatData(data)}`,
            appName,
            'Controller'
          );
        },
        error: (error) => {
          const responseTime = Date.now() - now;
          this.fileLogger.error(
            `[ERROR ${requestId}] ${method} ${url} - Handler: ${controller}.${handler}() - ${responseTime}ms\nError: ${error.message}`,
            appName,
            'Controller',
            error.stack
          );
        }
      })
    );
  }

  private logRpcCall(context: ExecutionContext, next: CallHandler): Observable<any> {
    const rpcContext = context.switchToRpc();
    const data = rpcContext.getData();
    const pattern = rpcContext.getContext();
    const requestId = this.generateRequestId();
    
    // Try to determine application name from RPC context or pattern
    const appName = this.getRpcApplicationName(pattern);
    
    const controller = context.getClass().name;
    const handler = context.getHandler().name;

    // Log RPC request
    this.fileLogger.log(
      `[RPC REQUEST ${requestId}] Pattern: ${JSON.stringify(pattern)} - Handler: ${controller}.${handler}()\nPayload: ${this.formatData(data)}`,
      appName,
      'Microservice'
    );

    const now = Date.now();
    return next.handle().pipe(
      tap({
        next: (response) => {
          const responseTime = Date.now() - now;
          this.fileLogger.log(
            `[RPC RESPONSE ${requestId}] Pattern: ${JSON.stringify(pattern)} - Handler: ${controller}.${handler}() - ${responseTime}ms\nResponse: ${this.formatData(response)}`,
            appName,
            'Microservice'
          );
        },
        error: (error) => {
          const responseTime = Date.now() - now;
          this.fileLogger.error(
            `[RPC ERROR ${requestId}] Pattern: ${JSON.stringify(pattern)} - Handler: ${controller}.${handler}() - ${responseTime}ms\nError: ${error.message}`,
            appName,
            'Microservice',
            error.stack
          );
        }
      })
    );
  }

  // Extract application name from URL
  private getApplicationName(url: string): string {
    const path = url.startsWith('/') ? url.substring(1) : url;
    const segments = path.split('/');
    
    if (segments.length > 0 && segments[0]) {
      return segments[0];
    }
    
    return 'api-gateway';
  }
  
  // Try to determine application name from RPC pattern
  private getRpcApplicationName(pattern: string | object): string {
    if (typeof pattern === 'string') {
      const patternParts = pattern.split('.');
      if (patternParts.length > 0) {
        return patternParts[0];
      }
    } else if (pattern && typeof pattern === 'object') {
      // Try to extract service name from pattern object
      if ('service' in pattern) {
        return String(pattern['service']);
      } else if ('cmd' in pattern) {
        const cmd = String(pattern['cmd']);
        const cmdParts = cmd.split('.');
        if (cmdParts.length > 0) {
          return cmdParts[0];
        }
      }
    }
    
    return 'api-gateway';
  }

  // Format data for logging (with truncation for large data)
  private formatData(data: any): string {
    try {
      const stringified = JSON.stringify(data);
      if (stringified.length > 1000) {
        return stringified.substring(0, 1000) + '... [truncated]';
      }
      return stringified;
    } catch (error) {
      return '[Unserializable data]';
    }
  }

  // Generate a unique request ID
  private generateRequestId(): string {
    return `req-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  }
}