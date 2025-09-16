import { appointmentTestService } from './appointmentTest.service';

import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';

import { CreateAppointmentTestDto } from '@app/shared';
import { AppointmentTestResponseDto } from '@app/shared';
import { UpdateAppointmentTestDto } from '@app/shared';

@Controller('bio/appointmentTest')
export class AppointmentTestController {

  constructor(private readonly appointmentTestService: appointmentTestService) {}

  @Post()
  async createAppointmentTest(@Body() createAppointmentTest: CreateAppointmentTestDto): Promise<AppointmentTestResponseDto> {
    return this.appointmentTestService.create(createAppointmentTest);
  }

  @Get()
  async getAllAppointmentTest(): Promise<AppointmentTestResponseDto[]> {
    return this.appointmentTestService.findAll();
  }

  @Get(':id')
  async getAppointmentTestById(@Param('id') id: string): Promise<AppointmentTestResponseDto> {
    return this.appointmentTestService.findById(id);
  }

  @Put(':id')
  async updateAppointmentTest(
    @Param('id') id: string,
    @Body() updateAppointmentTestDto: UpdateAppointmentTestDto
  ): Promise<AppointmentTestResponseDto> {
    return this.appointmentTestService.updateAppointmentTest(id, updateAppointmentTestDto);
  }

  @Delete(':id')
  async DeleteAppointmentTest(@Param('id') id: string): Promise<AppointmentTestResponseDto> {
    return this.appointmentTestService.delete(id);
  }

}
