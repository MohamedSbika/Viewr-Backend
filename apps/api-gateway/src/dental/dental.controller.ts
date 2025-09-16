import { Controller, Get, Logger, Inject, Req, Body, Post, Put, Delete, Param, Query, HttpException, HttpStatus } from '@nestjs/common';
import type { Request } from 'express';
import { RabbitMQService } from '@app/shared';
import { FileLoggerService } from '@app/shared';

@Controller('dental')
export class DentalController {
  private readonly logger = new Logger(DentalController.name);

  constructor(
    private readonly rabbitMQService: RabbitMQService,
    @Inject('FileLogger') private readonly fileLogger: FileLoggerService
  ) {
    this.logger.log('Dentist controller initialized');
  }


  // @Post('create')
  // async create(@Req() req: Request, @Body() body: any) {
  //   const queue = req.headers['x-target-queue'] as string;
  //   if (!queue) {
  //     throw new HttpException('Missing x-target-queue header', HttpStatus.BAD_REQUEST);
  //   }
  //   await this.rabbitMQService.sendToQueueWithPattern(queue, "create.dentist", body);
  //   return { status: 'sent', queue };
  // }


  // @Put('update/:id')
  // async update(@Req() req: Request, @Param('id') id: string, @Body() body: any) {
  //   const queue = req.headers['x-target-queue'] as string;
  //   if (!queue) {
  //     throw new HttpException('Missing x-target-queue header', HttpStatus.BAD_REQUEST);
  //   }
  //   await this.rabbitMQService.sendToQueueWithPattern(queue, "update.dentist", { id, ...body });
  //   return { status: 'sent', queue };
  // }


  // @Delete('delete/:id')
  // async delete(@Req() req: Request, @Param('id') id: string) {
  //   const queue = req.headers['x-target-queue'] as string;
  //   if (!queue) {
  //     throw new HttpException('Missing x-target-queue header', HttpStatus.BAD_REQUEST);
  //   }
  //   await this.rabbitMQService.sendToQueueWithPattern(queue, "delete.dentist", { id });
  //   return { status: 'sent', queue };
  // }


  // @Get('get/:id')
  // async get(@Req() req: Request, @Param('id') id: string) {
  //   const queue = req.headers['x-target-queue'] as string;
  //   if (!queue) {
  //     throw new HttpException('Missing x-target-queue header', HttpStatus.BAD_REQUEST);
  //   }
  //   await this.rabbitMQService.sendToQueueWithPattern(queue, "get.dentist", { id });
  //   return { status: 'sent', queue };
  // }


  // @Get('health')
  // async health(@Req() req: Request) {
  //   const queue = req.headers['x-target-queue'] as string;
  //   if (!queue) {
  //     throw new HttpException('Missing x-target-queue header', HttpStatus.BAD_REQUEST);
  //   }
  //   await this.rabbitMQService.sendToQueueWithPattern(queue, 'health.check', {});
  //   return { status: 'sent', queue };
  // }


  // @Get('inventory/status')
  // async inventoryStatus(@Req() req: Request) {
  //   const queue = req.headers['x-target-queue'] as string;
  //   if (!queue) {
  //     throw new HttpException('Missing x-target-queue header', HttpStatus.BAD_REQUEST);
  //   }
  //   await this.rabbitMQService.sendToQueueWithPattern(queue, 'inventory.status', {});
  //   return { status: 'sent', queue };
  // }


  @Get('dali')
  async taskStatus(@Req() req: Request) {
    const queue = req.headers['x-target-queue'] as string;
    if (!queue) {
      throw new HttpException('Missing x-target-queue header', HttpStatus.BAD_REQUEST);
    }
    return await this.rabbitMQService.sendMessage(queue, 'task.findAll', {});
  }

  // ...removed forwardToQueue helper, logic is now inline in each route
}
