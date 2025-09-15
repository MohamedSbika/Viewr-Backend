import { PartialType } from '@nestjs/mapped-types';
import { CreateDentalAppointmentDto } from './create-appointment.dto';

export class UpdateAppointmentDto extends PartialType(CreateDentalAppointmentDto) {}
