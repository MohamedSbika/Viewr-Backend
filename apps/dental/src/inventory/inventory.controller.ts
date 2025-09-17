import { Controller, HttpStatus } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { MessagePattern, RpcException } from '@nestjs/microservices';
import { FileLoggerService, FileLoggerService1 } from '@app/shared';

@Controller()
export class InventoryController {
  private readonly logFileName = 'inventory';

  constructor(
    private readonly inventoryService: InventoryService,
    private readonly logger: FileLoggerService1,
  ) {}
  @MessagePattern('inventory.status')
  getStatus() {
    this.logger.log(
      'Getting inventory module status',
      this.logFileName,
      'getStatus',
    );
    return { status: 'active', message: 'Inventory module is running' };
  }
}
