import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { EstablishmentAuth } from '@app/shared';
import { CreateEstablishmentDto } from './dto/create-establishment.dto';
import { UpdateEstablishmentDto } from './dto/update-establishment.dto';
import { EstablishmentResponseDto } from './dto/establishment-response.dto';
import { AssignPlanDto } from './dto/assign-plan.dto';

@Injectable()
export class EstablishmentService {
  private readonly logger = new Logger(EstablishmentService.name);

  constructor(
    @InjectRepository(EstablishmentAuth)
    private establishmentRepository: Repository<EstablishmentAuth>,
  ) {}

  async create(createEstablishmentDto: CreateEstablishmentDto): Promise<EstablishmentResponseDto> {
    try {
      // Generate a UUID and create the custom ID with the type prefix
      const uuid = require('uuid').v4();
      const customId = `${createEstablishmentDto.type}-${uuid}`;
      
      // Create the establishment with the custom ID
      const establishment = this.establishmentRepository.create({
        ...createEstablishmentDto,
        id: customId
      });
      
      // Save the establishment with the custom ID
      const savedEstablishment = await this.establishmentRepository.save(establishment);
      
      return this.mapToResponseDto(savedEstablishment);
    } catch (error) {
      this.logger.error(`Failed to create establishment: ${error.message}`, error.stack);
      throw new RpcException({
        message: 'Failed to create establishment',
        statusCode: 400
      });
    }
  }

  async findAll(): Promise<EstablishmentResponseDto[]> {
    try {
      const establishments = await this.establishmentRepository.find({
        relations: ['plan'],
      });
      return establishments.map(establishment => this.mapToResponseDto(establishment));
    } catch (error) {
      this.logger.error(`Failed to fetch establishments: ${error.message}`, error.stack);
      throw new RpcException({
        message: 'Failed to fetch establishments',
        statusCode: 500
      });
    }
  }

  async findOne(id: string): Promise<EstablishmentResponseDto> {
    try {
      const establishment = await this.establishmentRepository.findOne({ 
        where: { id },
        relations: ['plan'],
      });
      if (!establishment) {
        throw new NotFoundException(`Establishment with ID ${id} not found`);
      }
      return this.mapToResponseDto(establishment);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new RpcException({
          message: error.message,
          statusCode: 404
        });
      }
      this.logger.error(`Failed to fetch establishment: ${error.message}`, error.stack);
      throw new RpcException({
        message: 'Failed to fetch establishment',
        statusCode: 500
      });
    }
  }

  async update(id: string, updateEstablishmentDto: UpdateEstablishmentDto): Promise<EstablishmentResponseDto> {
    try {
      const establishment = await this.establishmentRepository.findOne({ where: { id } });
      if (!establishment) {
        throw new NotFoundException(`Establishment with ID ${id} not found`);
      }

      const updatedEstablishment = await this.establishmentRepository.save({
        ...establishment,
        ...updateEstablishmentDto,
      });
      return this.mapToResponseDto(updatedEstablishment);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new RpcException({
          message: error.message,
          statusCode: 404
        });
      }
      this.logger.error(`Failed to update establishment: ${error.message}`, error.stack);
      throw new RpcException({
        message: 'Failed to update establishment',
        statusCode: 400
      });
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      const result = await this.establishmentRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`Establishment with ID ${id} not found`);
      }
      this.logger.log(`Establishment with ID ${id} removed successfully`);
      // Return a success message object instead of void
      return { message: `Establishment with ID ${id} removed successfully` };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new RpcException({
          message: error.message,
          statusCode: 404
        });
      }
      this.logger.error(`Failed to remove establishment: ${error.message}`, error.stack);
      throw new RpcException({
        message: 'Failed to remove establishment',
        statusCode: 500
      });
    }
  }

  async assignPlan(id: string, assignPlanDto: AssignPlanDto): Promise<EstablishmentResponseDto> {
    try {
      const establishment = await this.establishmentRepository.findOne({ where: { id } });
      if (!establishment) {
        throw new NotFoundException(`Establishment with ID ${id} not found`);
      }

      establishment.planId = assignPlanDto.planId;
      const updatedEstablishment = await this.establishmentRepository.save(establishment);
      
      // Fetch with relations to return complete data
      const establishmentWithPlan = await this.establishmentRepository.findOne({
        where: { id },
        relations: ['plan'],
      });

      if (!establishmentWithPlan) {
        throw new NotFoundException(`Establishment with ID ${id} not found after updating plan`);
      }
      
      return this.mapToResponseDto(establishmentWithPlan);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new RpcException({
          message: error.message,
          statusCode: 404
        });
      }
      this.logger.error(`Failed to assign plan to establishment: ${error.message}`, error.stack);
      throw new RpcException({
        message: 'Failed to assign plan to establishment',
        statusCode: 400
      });
    }
  }

  private mapToResponseDto(establishment: EstablishmentAuth): EstablishmentResponseDto {
    const responseDto = new EstablishmentResponseDto();
    responseDto.id = establishment.id;
    responseDto.name = establishment.name;
    responseDto.description = establishment.description;
    responseDto.address = establishment.address;
    responseDto.longitude = establishment.longitude;
    responseDto.latitude = establishment.latitude;
    responseDto.phone = establishment.phone;
    responseDto.email = establishment.email;
    responseDto.isActive = establishment.isActive;
    responseDto.planId = establishment.planId;
    if (establishment.plan) {
      responseDto.plan = {
        id: establishment.plan.id,
        name: establishment.plan.name,
        price: establishment.plan.price,
        isActive: establishment.plan.isActive,
        createdAt: establishment.plan.createdAt,
        updatedAt: establishment.plan.updatedAt,
      };
    }
    responseDto.createdAt = establishment.createdAt;
    responseDto.updatedAt = establishment.updatedAt;
    return responseDto;
  }
}