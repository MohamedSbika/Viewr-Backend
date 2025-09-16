import { SafePartialType as PartialType } from '@app/shared';
import { CreateDentalAppointmentDto } from './create-appointment.dto';

export class UpdateAppointmentDto extends PartialType(CreateDentalAppointmentDto) {}
