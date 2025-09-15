/**
 * Interface for defining queue operations with type safety
 */
export interface QueueOperation<TRequest = any, TResponse = any> {
  queue: string;
  pattern: string;
  request: TRequest;
  timeout?: number;
}

/**
 * Interface for queue operation result
 */
export interface QueueOperationResult<TResponse = any> {
  success: boolean;
  data?: TResponse;
  error?: string;
}

/**
 * Type for queue operation executor function
 */
export type QueueOperationExecutor = <TRequest, TResponse>(
  operation: QueueOperation<TRequest, TResponse>
) => Promise<TResponse>;
