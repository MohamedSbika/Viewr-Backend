import { Injectable, LogLevel } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FileLoggerService {
  [x: string]: any;
  setContext(arg0: string) {
    throw new Error('Method not implemented.');
  }
  setLogFileName(logFileName: string) {
    throw new Error('Method not implemented.');
  }
  private readonly logsDir = path.join(process.cwd(), 'logs');

  constructor() {
    // Create logs directory if it doesn't exist
    if (!fs.existsSync(this.logsDir)) {
      fs.mkdirSync(this.logsDir, { recursive: true });
    }
  }

  /**
   * Log a message to a specific log file
   * @param message The message to log
   * @param context The context (e.g., service name)
   * @param applicationName The application name (for filename)
   * @param level The log level
   */
  private writeLog(message: string, applicationName: string, context: string, level: LogLevel): void {
    const date = new Date();
    const formattedDate = this.formatDate(date);
    const timestamp = date.toISOString();
    
    // Create application log directory if it doesn't exist
    const appDir = path.join(this.logsDir, applicationName);
    if (!fs.existsSync(appDir)) {
      fs.mkdirSync(appDir, { recursive: true });
    }
    
    // Format log entry
    const logEntry = `[${timestamp}] [${level.toUpperCase()}] [${context}] ${message}\n`;
    
    // Log to application-specific daily file
    const logFilePath = path.join(appDir, `${formattedDate}.log`);
    
    fs.appendFile(logFilePath, logEntry, (err) => {
      if (err) {
        console.error(`Failed to write log to file: ${err.message}`);
      }
    });
  }

  /**
   * Format date as YYYY-MM-DD for log filenames
   */
  private formatDate(date: Date): string {
    return [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, '0'),
      String(date.getDate()).padStart(2, '0'),
    ].join('-');
  }

  /**
   * Log an informational message
   */
  log(message: string, applicationName = 'api-gateway', context = 'Application'): void {
    this.writeLog(message, applicationName, context, 'log');
  }

  /**
   * Log an error message
   */
  error(message: string, applicationName = 'api-gateway', context = 'Application', trace?: string): void {
    const logMessage = trace ? `${message}\n${trace}` : message;
    this.writeLog(logMessage, applicationName, context, 'error');
  }

  /**
   * Log a warning message
   */
  warn(message: string, applicationName = 'api-gateway', context = 'Application'): void {
    this.writeLog(message, applicationName, context, 'warn');
  }

  /**
   * Log a debug message
   */
  debug(message: string, applicationName = 'api-gateway', context = 'Application'): void {
    this.writeLog(message, applicationName, context, 'debug');
  }

  /**
   * Log a verbose message
   */
  verbose(message: string, applicationName = 'api-gateway', context = 'Application'): void {
    this.writeLog(message, applicationName, context, 'verbose');
  }
}