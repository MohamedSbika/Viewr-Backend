import { SafePartialType as PartialType } from '@app/shared';
import { CreateBiologyAppointmentDto } from './createAppointement.dto'

export class UpdateBiologyAppointmentDto extends PartialType(CreateBiologyAppointmentDto) {}
