import { SafePartialType as PartialType } from '@app/shared';
import { CreatePatientDto } from './create-patient.dto';

export class UpdatePatientDto extends PartialType(CreatePatientDto) {}
