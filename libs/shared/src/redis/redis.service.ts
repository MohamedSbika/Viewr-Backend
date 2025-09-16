import { Injectable, Inject, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { ConfigService } from '@nestjs/config';
import IORedis from 'ioredis';

@Injectable()
export class RedisService {
  private readonly logger = new Logger(RedisService.name);
  private redisClient: IORedis;

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private configService: ConfigService
  ) {
    const redisHost = this.configService.get('REDIS_HOST', 'localhost');
    const redisPort = Number(this.configService.get('REDIS_PORT', 6379));
    const redisPassword = this.configService.get('REDIS_PASSWORD');
    const redisDb = Number(this.configService.get('REDIS_DB', 0));
    this.logger.log(`Connecting to Redis at ${redisHost}:${redisPort} with DB: ${redisDb} ${redisPassword ? 'and password' : 'without password'}`);
    // Create a separate Redis client for advanced operations
    this.redisClient = new IORedis({
      host: redisHost,
      port: redisPort,
      password: redisPassword,
      db: redisDb
    });
    this.redisClient.on('error', (err) => {
      this.logger.error(`Redis client error: ${err.message}`, err.stack);
    });
    this.redisClient.on('connect', () => {
      this.logger.log('Redis client connected successfully');
    });
  }

  /**
   * Pushes a value to a Redis list (LPUSH)
   * @param {string} key - The Redis list key
   * @param {string} value - The value to push
   * @returns {Promise<void>}
   */
  async lpush(key: string, value: string): Promise<void> {
    try {
      await this.redisClient.lpush(key, value);
      this.logger.debug(`LPUSH value to list: ${key}`);
    } catch (error) {
      this.logger.error(`Failed to LPUSH to list ${key}: ${error.message}`);
      throw error;
    }
  }


  /**
   * Stores a value in Redis cache with an optional time-to-live
   * @param {string} key - The key to store the value under
   * @param {string} value - The value to store
   * @param {number} [ttl] - Optional time-to-live in seconds
   * @returns {Promise<void>}
   * @throws {Error} If storing the value fails
   */
  async set(key: string, value: string, ttl?: number): Promise<void> {
    try {
      if (ttl) {
        await this.redisClient.set(key, value, 'EX', ttl);
      } else {
        await this.redisClient.set(key, value);
      }
      this.logger.debug(`Stored key: ${key} in Redis cache`);
    } catch (error) {
      this.logger.error(`Failed to store key: ${key} in Redis cache: ${error.message}`);
      throw error;
    }
  }

  /**
   * Retrieves a value from Redis cache by key
   * @param {string} key - The key to retrieve
   * @returns {Promise<string|null>} The value if found, null otherwise
   * @throws {Error} If retrieving the value fails
   */
  async get(key: string): Promise<string | null> {
    try {
      const value = await this.redisClient.get(key);
      this.logger.debug(`Retrieved value for key: ${key} from Redis cache`);
      return value;
    } catch (error) {
      this.logger.error(`Failed to retrieve key: ${key} from Redis cache: ${error.message}`);
      throw error;
    }
  }

  /**
   * Deletes a value from Redis cache by key
   * @param {string} key - The key to delete
   * @returns {Promise<void>}
   * @throws {Error} If deleting the value fails
   */
  async del(key: string): Promise<void> {
    try {
      await this.redisClient.del(key);
      this.logger.debug(`Deleted key: ${key} from Redis cache`);
    } catch (error) {
      this.logger.error(`Failed to delete key: ${key} from Redis cache: ${error.message}`);
      throw error;
    }
  }

  /**
   * Find all keys matching a pattern
   * @param {string} pattern - Pattern to search for (e.g. user:*)
   * @returns {Promise<string[]>} Array of matching keys
   */
  async keys(pattern: string): Promise<string[]> {
    try {
      const keys = await this.redisClient.keys(pattern);
      this.logger.debug(`Found ${keys.length} keys matching pattern: ${pattern}`);
      return keys;
    } catch (error) {
      this.logger.error(`Failed to find keys with pattern: ${pattern}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Gets multiple values from Redis by their keys
   * @param {string[]} keys - Array of keys to get values for
   * @returns {Promise<Record<string, string>>} Object with key-value pairs
   */
  async mget(keys: string[]): Promise<Record<string, string>> {
    if (!keys || keys.length === 0) {
      return {};
    }

    try {
      const values = await this.redisClient.mget(keys);
      const result: Record<string, string> = {};
      
      keys.forEach((key, index) => {
        if (values[index]) {
          result[key] = values[index];
        }
      });
      
      return result;
    } catch (error) {
      this.logger.error(`Failed to get multiple keys: ${error.message}`);
      throw error;
    }
  }

  /**
   * Scan for keys matching a pattern (better than KEYS for production)
   * @param {string} pattern - Pattern to search for (e.g. user:*)
   * @returns {Promise<string[]>} Array of matching keys
   */
  async scanPattern(pattern: string): Promise<string[]> {
    try {
      const keys: string[] = [];
      let cursor = 0;
      
      do {
        const result = await this.redisClient.scan(cursor, 'MATCH', pattern, 'COUNT', 100);
        cursor = parseInt(result[0]);
        keys.push(...result[1]);
      } while (cursor !== 0);
      
      this.logger.debug(`Found ${keys.length} keys matching pattern: ${pattern}`);
      return keys;
    } catch (error) {
      this.logger.error(`Failed to scan keys with pattern: ${pattern}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Delete multiple keys at once
   * @param {string[]} keys - Array of keys to delete
   * @returns {Promise<number>} Number of keys deleted
   */
  async delMultiple(keys: string[]): Promise<number> {
    if (!keys || keys.length === 0) {
      return 0;
    }

    try {
      const deleted = await this.redisClient.del(...keys);
      this.logger.debug(`Deleted ${deleted} keys from Redis`);
      return deleted;
    } catch (error) {
      this.logger.error(`Failed to delete multiple keys: ${error.message}`);
      throw error;
    }
  }
}