import { Injectable, LoggerService } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FileLoggerService implements LoggerService {
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
   * @param logFileName The name of the log file (without extension)
   * @param context Optional context for the log entry
   */
  log(message: any, logFileName: string, context?: string): void {
    this.writeToFile('log', message, logFileName, context);
  }

  /**
   * Log an error message to a specific log file
   * @param message The error message
   * @param logFileName The name of the log file (without extension)
   * @param trace Optional stack trace
   * @param context Optional context for the log entry
   */
  error(message: any, logFileName: string, trace?: string, context?: string): void {
    this.writeToFile('error', message, logFileName, context, trace);
  }

  /**
   * Log a warning message to a specific log file
   * @param message The warning message
   * @param logFileName The name of the log file (without extension)
   * @param context Optional context for the log entry
   */
  warn(message: any, logFileName: string, context?: string): void {
    this.writeToFile('warn', message, logFileName, context);
  }

  /**
   * Log a debug message to a specific log file
   * @param message The debug message
   * @param logFileName The name of the log file (without extension)
   * @param context Optional context for the log entry
   */
  debug(message: any, logFileName: string, context?: string): void {
    this.writeToFile('debug', message, logFileName, context);
  }

  /**
   * Log a verbose message to a specific log file
   * @param message The verbose message
   * @param logFileName The name of the log file (without extension)
   * @param context Optional context for the log entry
   */
  verbose(message: any, logFileName: string, context?: string): void {
    this.writeToFile('verbose', message, logFileName, context);
  }

  /**
   * Write a log entry to a specific log file
   * @param level The log level
   * @param message The message to log
   * @param logFileName The name of the log file (without extension)
   * @param context Optional context for the log entry
   * @param trace Optional stack trace for error logs
   */
  private writeToFile(
    level: string,
    message: any,
    logFileName: string,
    context?: string,
    trace?: string,
  ): void {
    try {
      const timestamp = new Date().toISOString();
      const logFilePath = path.join(this.logsDir, `${logFileName}.log`);
      
      let logEntry = `[${timestamp}] [${level.toUpperCase()}]`;
      
      if (context) {
        logEntry += ` [${context}]`;
      }
      
      logEntry += `: ${message}`;
      
      if (trace) {
        logEntry += `\n${trace}`;
      }
      
      logEntry += '\n';
      
      fs.appendFileSync(logFilePath, logEntry);
    } catch (error) {
      // If logging to file fails, log to console as a fallback
      console.error('Failed to write to log file:', error.message);
      console.log(`[${level.toUpperCase()}] ${message}`);
    }
  }
}