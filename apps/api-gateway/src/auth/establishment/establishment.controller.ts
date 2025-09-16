import { Controller, Get, Post, Body, Param, Put, Delete, Logger, Inject } from '@nestjs/common';
import { EstablishmentService } from './establishment.service';
import { CreateEstablishmentDto } from '@app/shared';
import { UpdateEstablishmentDto } from '@app/shared';
import { EstablishmentResponseDto } from '@app/shared';
import { FileLoggerService } from '@app/shared';

@Controller('auth/establishments')
export class EstablishmentController {
  private readonly logger = new Logger(EstablishmentController.name);

  constructor(
    private readonly establishmentService: EstablishmentService,
    @Inject('FileLogger') private readonly fileLogger: FileLoggerService
  ) {
    this.logger.log('Establishment controller initialized');
  }

  /**
   * Creates a new establishment
   * @param {CreateEstablishmentDto} createEstablishmentDto - The establishment data
   * @returns {Promise<EstablishmentResponseDto>} Created establishment information
   */
  @Post()
  async createEstablishment(@Body() createEstablishmentDto: CreateEstablishmentDto): Promise<EstablishmentResponseDto> {
    const logMessage = `Creating new establishment: ${createEstablishmentDto.name}`;
    this.fileLogger.log(logMessage, 'establishment-create', EstablishmentController.name);
    return this.establishmentService.createEstablishment(createEstablishmentDto);
  }

  /**
   * Gets all establishments
   * @returns {Promise<EstablishmentResponseDto[]>} List of all establishments
   */
  @Get()
  async getAllEstablishments(): Promise<EstablishmentResponseDto[]> {
    const logMessage = 'Getting all establishments';
    this.fileLogger.log(logMessage, 'establishment-findAll', EstablishmentController.name);
    return this.establishmentService.getAllEstablishments();
  }

  /**
   * Gets a specific establishment by ID
   * @param {string} id - Establishment ID
   * @returns {Promise<EstablishmentResponseDto>} The establishment details
   */
  @Get(':id')
  async getEstablishmentById(@Param('id') id: string): Promise<EstablishmentResponseDto> {
    const logMessage = `Getting establishment with ID: ${id}`;
    this.fileLogger.log(logMessage, 'establishment-findOne', EstablishmentController.name);
    return this.establishmentService.getEstablishmentById(id);
  }

  /**
   * Updates an establishment
   * @param {string} id - Establishment ID
   * @param {UpdateEstablishmentDto} updateEstablishmentDto - Updated establishment data
   * @returns {Promise<EstablishmentResponseDto>} The updated establishment
   */
  @Put(':id')
  async updateEstablishment(
    @Param('id') id: string,
    @Body() updateEstablishmentDto: UpdateEstablishmentDto
  ): Promise<EstablishmentResponseDto> {
    const logMessage = `Updating establishment with ID: ${id}`;
    this.fileLogger.log(logMessage, 'establishment-update', EstablishmentController.name);
    return this.establishmentService.updateEstablishment(id, updateEstablishmentDto);
  }

  /**
   * Deletes an establishment
   * @param {string} id - Establishment ID
   * @returns {Promise<void>}
   */
  @Delete(':id')
  async deleteEstablishment(@Param('id') id: string): Promise<void> {
    const logMessage = `Deleting establishment with ID: ${id}`;
    this.fileLogger.log(logMessage, 'establishment-remove', EstablishmentController.name);
    return this.establishmentService.deleteEstablishment(id);
  }
}