import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { ClientProxyFactory, Transport, ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';

/**
 * RabbitMQService - A general-purpose service for communicating with RabbitMQ queues
 * 
 * This service provides a flexible way to send messages to different RabbitMQ queues
 * based on dynamic queue names (typically from request headers via QueueHeaderMiddleware).
 * 
 * Key Features:
 * - Dynamic queue selection based on request headers
 * - Connection pooling for different queues
 * - Automatic error handling and logging
 * - Support for both request-response and fire-and-forget patterns
 * - TypeScript support with proper error handling
 * 
 * Usage:
 * 1. The QueueHeaderMiddleware extracts the 'x-target-queue' header
 * 2. Controllers pass the queue name to service methods
 * 3. This service creates/reuses ClientProxy instances for each queue
 * 4. Messages are sent with the specified pattern and payload
 * 
 * Example:
 * ```typescript
 * // In your service method:
 * const result = await this.rabbitMQService.sendMessage(
 *   'dentist_queue',
 *   'task.findAll',
 *   { userId: '123' }
 * );
 * ```
 */
@Injectable()
export class RabbitMQService {
  private readonly logger = new Logger(RabbitMQService.name);
  private readonly clientProxies = new Map<string, ClientProxy>();

  constructor() {
    this.logger.log('RabbitMQ Service initialized');
  }

  /**
   * Gets or creates a ClientProxy for the specified queue
   * @param {string} queueName - The name of the queue
   * @returns {ClientProxy} The ClientProxy instance for the queue
   */
  private getClientProxy(queueName: string): ClientProxy {
    if (!this.clientProxies.has(queueName)) {
      const client = ClientProxyFactory.create({
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
          queue: queueName,
          queueOptions: {
            durable: true,
          },
        },
      });
      this.clientProxies.set(queueName, client);
      this.logger.log(`Created ClientProxy for queue: ${queueName}`);
    }
    return this.clientProxies.get(queueName)!;
  }

  /**
   * Sends a message to a specified queue with a message pattern and returns the response
   * @param {string} queueName - The name of the queue to send the message to
   * @param {string} messagePattern - The message pattern/command to send
   * @param {any} payload - The payload to send with the message
   * @returns {Promise<any>} The response from the microservice
   */
  async sendMessage(queueName: string, messagePattern: string, payload: any = {}): Promise<any> {
    try {
      this.logger.log(`Sending message to queue: ${queueName}, pattern: ${messagePattern}`);
      
      const client = this.getClientProxy(queueName);
      const response = await firstValueFrom(
        client.send(messagePattern, payload).pipe(
          timeout(30000) // 30 second timeout
        )
      );
      
      this.logger.log(`Received response from queue: ${queueName}, pattern: ${messagePattern}`);
      return response;
    } catch (error) {
      const errorMessage = error?.message || error?.toString() || 'Unknown error occurred';
      const errorDetails = {
        queue: queueName,
        pattern: messagePattern,
        payload: JSON.stringify(payload),
        originalError: error?.stack || error?.toString() || 'No stack trace available'
      };
      
      this.logger.error(
        `Error sending message to queue: ${queueName}, pattern: ${messagePattern}, error: ${errorMessage}`,
        JSON.stringify(errorDetails)
      );
      
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'RabbitMQ Communication Error',
          message: `Failed to communicate with queue ${queueName}: ${errorMessage}`,
          details: errorDetails
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Sends a message to a queue without expecting a response (fire-and-forget)
   * @param {string} queueName - The name of the queue to send the message to
   * @param {string} messagePattern - The message pattern/command to send
   * @param {any} payload - The payload to send with the message
   */
  async sendMessageFireAndForget(queueName: string, messagePattern: string, payload: any = {}): Promise<void> {
    try {
      this.logger.log(`Sending fire-and-forget message to queue: ${queueName}, pattern: ${messagePattern}`);
      
      const client = this.getClientProxy(queueName);
      client.emit(messagePattern, payload);
      
      this.logger.log(`Fire-and-forget message sent to queue: ${queueName}, pattern: ${messagePattern}`);
    } catch (error) {
      this.logger.error(
        `Error sending fire-and-forget message to queue: ${queueName}, pattern: ${messagePattern}, error: ${error.message}`,
        error.stack
      );
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Internal Server Error',
          message: 'An error occurred while sending the message'
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Closes all client connections
   */
  async closeConnections(): Promise<void> {
    this.logger.log('Closing all RabbitMQ client connections');
    
    const closePromises = Array.from(this.clientProxies.values()).map(client => 
      client.close().catch(error => 
        this.logger.error(`Error closing client connection: ${error.message}`)
      )
    );
    
    await Promise.all(closePromises);
    this.clientProxies.clear();
    this.logger.log('All RabbitMQ client connections closed');
  }

  /**
   * Legacy method for backward compatibility - use sendMessage instead
   * @deprecated Use sendMessage instead
   */
  async sendToQueueWithPattern(queueName: string, messagePattern: string, payload: any = {}): Promise<any> {
    this.logger.warn('sendToQueueWithPattern is deprecated, use sendMessage instead');
    return this.sendMessage(queueName, messagePattern, payload);
  }
}
