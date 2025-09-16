import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

/**
 * Main application service for the dental microservice
 *
 * Provides basic application-level operations and health check functionality.
 * Handles RPC communication with proper error handling and logging.
 */
@Injectable()
export class DentalService {
  /**
   * Returns a simple greeting message for health check purposes
   *
   * @returns A greeting string indicating the service is operational
   * @throws RpcException with HTTP 500 status if an error occurs
   */
  getHello(): string {
    try {
      return 'Hello World!';
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error in getHello method';
      throw new RpcException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Internal Server Error',
        message: errorMessage,
      });
    }
  }
}
