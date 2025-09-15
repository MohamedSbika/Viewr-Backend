import { PartialType } from '@nestjs/mapped-types';
import { CreateBiologyAppointmentDto } from './createAppointement.dto'

export class UpdateBiologyAppointmentDto extends PartialType(CreateBiologyAppointmentDto) {}
