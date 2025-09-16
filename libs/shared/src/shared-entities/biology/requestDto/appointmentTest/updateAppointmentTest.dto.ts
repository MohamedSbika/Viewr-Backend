import { SafePartialType as PartialType } from '@app/shared';
import { CreateAppointmentTestDto } from '../../requestDto/appointmentTest/createAppointmentTest.dto'

export class UpdateAppointmentTestDto extends PartialType(CreateAppointmentTestDto) {}
