import { Injectable, LoggerService } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { LoggerConfig } from './logger.config';

@Injectable()
export class FileLoggerService1 implements LoggerService {
  private readonly logsDir = LoggerConfig.LOGS_DIR;
  private context: string;
  private defaultLogFileName: string = 'app';

  constructor() {
    // Initialize logs directory
    LoggerConfig.initLogsDirectory();
  }

  /**
   * Set a default context for all log messages
   * @param context The context to use for log entries
   */
  setContext(context: string): void {
    this.context = context;
  }

  /**
   * Set a default log file name
   * @param logFileName The default log file name to use
   */
  setLogFileName(logFileName: string): void {
    this.defaultLogFileName = logFileName;
  }

  getContext(): string {
    return this.context;
  }

  /**
   * Log a message to a specific log file
   * @param message The message to log
   * @param logFileNameOrContext Optional log file name or context
   * @param context Optional context for the log entry
   */ log(message: any, logFileNameOrContext?: string, context?: string): void {
    // Handle different parameter patterns
    let logFileName = this.defaultLogFileName;
    let actualContext = this.context;

    if (logFileNameOrContext) {
      // If only two parameters are provided, the second could be either logFileName or context
      if (context) {
        // If three parameters are provided, treat the second as logFileName and third as context
        logFileName = logFileNameOrContext;
        actualContext = context;
      } else {
        // If only two parameters, use the default logFileName and treat the second parameter as context
        actualContext = logFileNameOrContext;
      }
    }

    this.writeToFile('log', message, logFileName, actualContext);
  }
  /**
   * Log an error message to a specific log file
   * @param message The error message
   * @param logFileNameOrContext Optional log file name or context
   * @param traceOrContext Optional stack trace or context
   * @param context Optional context for the log entry when trace is provided
   */
  error(
    message: any,
    logFileNameOrContext?: string,
    traceOrContext?: string,
    context?: string,
  ): void {
    // Handle different parameter patterns
    let logFileName = this.defaultLogFileName;
    let actualContext = this.context;
    let trace: string | undefined;

    if (logFileNameOrContext) {
      if (context) {
        // If four parameters are provided
        logFileName = logFileNameOrContext;
        trace = traceOrContext;
        actualContext = context;
      } else if (traceOrContext) {
        // If three parameters are provided
        // Check if the second parameter looks like a stack trace
        if (traceOrContext.includes('\n') || traceOrContext.includes('at ')) {
          trace = traceOrContext;
        } else {
          actualContext = traceOrContext;
        }
      } else {
        // If only two parameters
        actualContext = logFileNameOrContext;
      }
    }

    this.writeToFile('error', message, logFileName, actualContext, trace);
  }
  /**
   * Log a warning message to a specific log file
   * @param message The warning message
   * @param logFileNameOrContext Optional log file name or context
   * @param context Optional context for the log entry
   */
  warn(message: any, logFileNameOrContext?: string, context?: string): void {
    // Handle different parameter patterns
    let logFileName = this.defaultLogFileName;
    let actualContext = this.context;

    if (logFileNameOrContext) {
      if (context) {
        logFileName = logFileNameOrContext;
        actualContext = context;
      } else {
        actualContext = logFileNameOrContext;
      }
    }

    this.writeToFile('warn', message, logFileName, actualContext);
  }
  /**
   * Log a debug message to a specific log file
   * @param message The debug message
   * @param logFileNameOrContext Optional log file name or context
   * @param context Optional context for the log entry
   */
  debug(message: any, logFileNameOrContext?: string, context?: string): void {
    // Handle different parameter patterns
    let logFileName = this.defaultLogFileName;
    let actualContext = this.context;

    if (logFileNameOrContext) {
      if (context) {
        logFileName = logFileNameOrContext;
        actualContext = context;
      } else {
        actualContext = logFileNameOrContext;
      }
    }

    this.writeToFile('debug', message, logFileName, actualContext);
  }
  /**
   * Log a verbose message to a specific log file
   * @param message The verbose message
   * @param logFileNameOrContext Optional log file name or context
   * @param context Optional context for the log entry
   */
  verbose(message: any, logFileNameOrContext?: string, context?: string): void {
    // Handle different parameter patterns
    let logFileName = this.defaultLogFileName;
    let actualContext = this.context;

    if (logFileNameOrContext) {
      if (context) {
        logFileName = logFileNameOrContext;
        actualContext = context;
      } else {
        actualContext = logFileNameOrContext;
      }
    }

    this.writeToFile('verbose', message, logFileName, actualContext);
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
    logFileName: string = this.defaultLogFileName,
    context?: string,
    trace?: string,
  ): void {
    try {
      // Check if this log level should be logged based on configuration
      if (!LoggerConfig.shouldLog(level)) {
        return;
      }

      const timestamp = new Date().toISOString();
      const logFilePath = path.join(this.logsDir, `${logFileName}.log`);

      // Check if log rotation is needed
      LoggerConfig.rotateLogFileIfNeeded(logFilePath);

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

      // Also append to a combined log file for easier searching
      if (level.toLowerCase() === 'error') {
        const errorLogPath = path.join(this.logsDir, 'error.log');
        LoggerConfig.rotateLogFileIfNeeded(errorLogPath);
        fs.appendFileSync(errorLogPath, logEntry);
      }

      // Keep an all.log file with everything
      const allLogPath = path.join(this.logsDir, 'all.log');
      LoggerConfig.rotateLogFileIfNeeded(allLogPath);
      fs.appendFileSync(allLogPath, logEntry);
    } catch (error) {
      // If logging to file fails, log to console as a fallback
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      console.error('Failed to write to log file:', errorMessage);
      console.log(`[${level.toUpperCase()}] ${message}`);
    }
  }
}
