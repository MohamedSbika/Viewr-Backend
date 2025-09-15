
import { IsString, IsDateString, IsEnum, IsOptional } from 'class-validator';
import { GENDER } from '@app/shared';
import { PartialType } from '@nestjs/mapped-types';
import { createPatientDto } from './createPatient.dto';

export class UpdateBiologyPatientDto extends PartialType(createPatientDto) {}
