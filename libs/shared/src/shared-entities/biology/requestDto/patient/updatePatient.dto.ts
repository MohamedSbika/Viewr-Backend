
import { SafePartialType as PartialType } from '@app/shared';
import { createBiologyPatientDto } from './createPatient.dto';

export class UpdateBiologyPatientDto extends PartialType(createBiologyPatientDto) {}
