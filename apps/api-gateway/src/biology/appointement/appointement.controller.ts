import { Controller, Get, Post, Body, Param, Put, Delete, NotFoundException } from '@nestjs/common';
import { AppointementService } from './appointement.service';
import { CreateBiologyAppointmentDto ,AppointmenResponseDto,UpdateBiologyAppointmentDto } from '@app/shared';

@Controller('bio/appointement')
export class AppointementController {
  constructor(private readonly appointementService: AppointementService) {}

  @Post()
  async createAppointement(
    @Body() createAppointementDto: CreateBiologyAppointmentDto
  ): Promise<AppointmenResponseDto> {
    return await this.appointementService.create(createAppointementDto);
  }

  @Get()
  async getAllAppointments(): Promise<AppointmenResponseDto[]> {
    return await this.appointementService.findAll();
  }

  @Get(':id')
  async getAppointementById(@Param('id') id: string): Promise<AppointmenResponseDto> {
    const appointement = await this.appointementService.findById(id);
    return appointement;
  }

  @Put(':id')
  async updateAppointement(
    @Param('id') id: string,
    @Body() updateAppointement: UpdateBiologyAppointmentDto
  ): Promise<AppointmenResponseDto> {
    const appointement = await this.appointementService.updateAppointement(id, updateAppointement);
    return appointement;
  }

  @Delete(':id')
  async DeleteAppointement(@Param('id') id: string): Promise<AppointmenResponseDto> {
    const appointement = await this.appointementService.delete(id);
    return appointement;
  }
 
@Get('history/:patientId')
async findPatientHistory(@Param('patientId') patientId: string):Promise<AppointmenResponseDto>  {
  const appointement= await this.appointementService.findPatientHistory (patientId);
  return appointement;
}

}


