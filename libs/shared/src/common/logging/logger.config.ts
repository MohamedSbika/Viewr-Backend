import { join } from 'path';
import * as fs from 'fs';

export class LoggerConfig {
  // Log levels in order of increasing severity
  static readonly LOG_LEVELS = {
    VERBOSE: 0,
    DEBUG: 1,
    LOG: 2,
    WARN: 3,
    ERROR: 4,
  };

  // Current log level (can be set via environment variable)
  static readonly CURRENT_LEVEL = process.env.LOG_LEVEL
    ? (LoggerConfig.LOG_LEVELS[
        process.env.LOG_LEVEL as keyof typeof LoggerConfig.LOG_LEVELS
      ] ?? LoggerConfig.LOG_LEVELS.LOG)
    : LoggerConfig.LOG_LEVELS.LOG;

  // Maximum log file size in bytes (10MB default)
  static readonly MAX_LOG_SIZE = parseInt(
    process.env.MAX_LOG_SIZE || '10485760',
    10,
  );

  // Maximum number of log files to keep per type
  static readonly MAX_LOG_FILES = parseInt(
    process.env.MAX_LOG_FILES || '5',
    10,
  );

  // Directory where logs are stored
  static readonly LOGS_DIR = join(process.cwd(), 'logs');

  // Initialize logs directory
  static initLogsDirectory(): void {
    if (!fs.existsSync(LoggerConfig.LOGS_DIR)) {
      fs.mkdirSync(LoggerConfig.LOGS_DIR, { recursive: true });
    }
  }

  // Check if a log message should be logged based on current level
  static shouldLog(level: string): boolean {
    const levelValue =
      LoggerConfig.LOG_LEVELS[
        level.toUpperCase() as keyof typeof LoggerConfig.LOG_LEVELS
      ] ?? 0;
    return levelValue >= LoggerConfig.CURRENT_LEVEL;
  }

  // Rotate log file if it exceeds the maximum size
  static rotateLogFileIfNeeded(logFilePath: string): void {
    try {
      if (fs.existsSync(logFilePath)) {
        const stats = fs.statSync(logFilePath);

        if (stats.size >= LoggerConfig.MAX_LOG_SIZE) {
          // Rotate log files
          for (let i = LoggerConfig.MAX_LOG_FILES - 1; i > 0; i--) {
            const oldPath = `${logFilePath}.${i}`;
            const newPath = `${logFilePath}.${i + 1}`;

            if (fs.existsSync(oldPath)) {
              if (i === LoggerConfig.MAX_LOG_FILES - 1) {
                // Delete the oldest log file
                fs.unlinkSync(oldPath);
              } else {
                // Rename current rotation to next number
                fs.renameSync(oldPath, newPath);
              }
            }
          }

          // Rename current log file to .1
          fs.renameSync(logFilePath, `${logFilePath}.1`);

          // Create a new empty log file
          fs.writeFileSync(logFilePath, '');
        }
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      console.error('Failed to rotate log file:', errorMessage);
    }
  }
}
