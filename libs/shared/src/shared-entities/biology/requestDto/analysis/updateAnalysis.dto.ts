// dtos/update-analysis.dto.ts

import { PartialType } from '@nestjs/mapped-types';
import { CreateAnalysisDto } from '../analysis/createAnalysis.dto';

export class UpdateAnalysisDto extends PartialType(CreateAnalysisDto) {}
