import { PartialType } from '@nestjs/mapped-types';
import { CreateAppointmentTestDto } from '../../requestDto/appointmentTest/createAppointmentTest.dto'

export class UpdateAppointmentTestDto extends PartialType(CreateAppointmentTestDto) {}
