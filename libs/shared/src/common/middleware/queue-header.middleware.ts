import { Injectable, NestMiddleware, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class QueueHeaderMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const queue = req.header('x-target-queue');
    if (!queue) {
      throw new HttpException('Missing x-target-queue header', HttpStatus.BAD_REQUEST);
    }
    // Attach queue to request object for downstream usage
    (req as any).targetQueue = queue;
    next();
  }
}
