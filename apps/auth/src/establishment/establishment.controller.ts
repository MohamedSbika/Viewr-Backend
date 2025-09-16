import { Controller, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { EstablishmentService } from './establishment.service';
import { CreateEstablishmentDto } from './dto/create-establishment.dto';
import { UpdateEstablishmentDto } from './dto/update-establishment.dto';
import { EstablishmentResponseDto } from './dto/establishment-response.dto';
import { AssignPlanDto } from './dto/assign-plan.dto';
import { FileLoggerService } from '../logging/file-logger.service';

@Controller()
export class EstablishmentController {
  private readonly logger = new Logger(EstablishmentController.name);

  constructor(
    private readonly establishmentService: EstablishmentService,
    private readonly fileLogger: FileLoggerService
  ) {}

  /**
   * Creates a new establishment
   * @param {CreateEstablishmentDto} createEstablishmentDto - The establishment data
   * @returns {Promise<EstablishmentResponseDto>} Created establishment information
   */
  @MessagePattern('establishment.create')
  async create(createEstablishmentDto: CreateEstablishmentDto): Promise<EstablishmentResponseDto> {
    const logMessage = `Creating new establishment: ${createEstablishmentDto.name}`;
    this.fileLogger.log(logMessage, 'establishment-create', EstablishmentController.name);
    return this.establishmentService.create(createEstablishmentDto);
  }

  /**
   * Gets all establishments
   * @returns {Promise<EstablishmentResponseDto[]>} List of all establishments
   */
  @MessagePattern('establishment.findAll')
  async findAll(): Promise<EstablishmentResponseDto[]> {
    const logMessage = 'Getting all establishments';
    this.fileLogger.log(logMessage, 'establishment-findAll', EstablishmentController.name);
    return this.establishmentService.findAll();
  }

  /**
   * Gets a specific establishment by ID
   * @param {{id: string}} data - Object containing the establishment ID
   * @returns {Promise<EstablishmentResponseDto>} The establishment details
   */
  @MessagePattern('establishment.findOne')
  async findOne(data: { id: string }): Promise<EstablishmentResponseDto> {
    const logMessage = `Getting establishment with ID: ${data.id}`;
    this.fileLogger.log(logMessage, 'establishment-findOne', EstablishmentController.name);
    return this.establishmentService.findOne(data.id);
  }

  /**
   * Updates an establishment
   * @param {{id: string, updateEstablishmentDto: UpdateEstablishmentDto}} data - Object containing ID and update data
   * @returns {Promise<EstablishmentResponseDto>} The updated establishment
   */
  @MessagePattern('establishment.update')
  async update(data: { id: string; updateEstablishmentDto: UpdateEstablishmentDto }): Promise<EstablishmentResponseDto> {
    const logMessage = `Updating establishment with ID: ${data.id}`;
    this.fileLogger.log(logMessage, 'establishment-update', EstablishmentController.name);
    return this.establishmentService.update(data.id, data.updateEstablishmentDto);
  }

  /**
   * Deletes an establishment
   * @param {{id: string}} data - Object containing the establishment ID
   * @returns {Promise<{ message: string }>} Success message
   */
  @MessagePattern('establishment.remove')
  async remove(data: { id: string }): Promise<{ message: string }> {
    const logMessage = `Removing establishment with ID: ${data.id}`;
    this.fileLogger.log(logMessage, 'establishment-remove', EstablishmentController.name);
    return this.establishmentService.remove(data.id);
  }

  /**
   * Assigns a plan to an establishment
   * @param {{id: string, assignPlanDto: AssignPlanDto}} data - Object containing ID and plan assignment data
   * @returns {Promise<EstablishmentResponseDto>} The updated establishment with plan
   */
  @MessagePattern('establishment.assignPlan')
  async assignPlan(data: { id: string; assignPlanDto: AssignPlanDto }): Promise<EstablishmentResponseDto> {
    const logMessage = `Assigning plan to establishment with ID: ${data.id}`;
    this.fileLogger.log(logMessage, 'establishment-assignPlan', EstablishmentController.name);
    return this.establishmentService.assignPlan(data.id, data.assignPlanDto);
  }
}