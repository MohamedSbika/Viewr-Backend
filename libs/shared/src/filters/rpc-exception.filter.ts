import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';

@Catch(HttpException)
export class RpcValidationFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctxType = host.getType();

    const response = exception.getResponse();
    const status = exception.getStatus();

    const errorBody = {
      statusCode: status || HttpStatus.INTERNAL_SERVER_ERROR,
      message:
        (typeof response === 'string' ? response : (response as any).message) || 'Internal server error',
      timestamp: new Date().toISOString(),
    };

    if (ctxType === 'http') {
      const ctx = host.switchToHttp();
      return ctx.getResponse().status(status).json(errorBody);
    }

    if (ctxType === 'rpc') {
      return errorBody; 
    }
  }
}
