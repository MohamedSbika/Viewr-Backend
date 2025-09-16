/**
 * Redis key prefixes used throughout the application
 * This helps with organizing data and avoiding key collisions
 */
export const REDIS_KEYS = {
  // Authentication related keys
  AUTH: {
    // Token storage
    REFRESH_TOKEN: 'refresh_token:',  // Currently used format: refresh_token:{userId}:{tokenId}
    
    // OTP for login
    OTP: 'otp:',
    // Reserved for future use
    ACCESS_TOKEN: 'access_token:',
    VERIFICATION_CODE: 'verify_code:',
    PASSWORD_RESET: 'password_reset:',
    BLACKLIST: 'blacklist:',
  },
  
  // Reserved for future use
  USER: {
    PROFILE: 'user:profile:',
    SESSIONS: 'user:sessions:',
  },
  
  // Reserved for future use
  CACHE: {
    ESTABLISHMENT: 'cache:establishment:',
    FEATURES: 'cache:features:',
    ROLES: 'cache:roles:',
  }
};

/**
 * Builds a Redis key with the appropriate prefix
 * @param prefix The prefix from REDIS_KEYS
 * @param identifiers Array of identifiers to append to the key
 * @returns Formatted Redis key
 */
export const buildRedisKey = (prefix: string, ...identifiers: string[]): string => {
  return `${prefix}${identifiers.join(':')}`;
};