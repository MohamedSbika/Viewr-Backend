import { MessagePattern } from '@nestjs/microservices';

export class HealthController {
  /**
   * Check the health status of the auth microservice
   * @description Returns service health information including uptime and memory usage
   * @returns {Promise<object>} Health check response with status, service name, timestamp, uptime, and memory usage
   */
  @MessagePattern('health.check')
  checkHealth() {
    return {
      status: 'ok',
      service: 'auth-service',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
    };
  }
}
