// dtos/update-analysis.dto.ts

import { SafePartialType as PartialType } from '@app/shared';
import { CreateAnalysisDto } from '../analysis/createAnalysis.dto';

export class UpdateAnalysisDto extends PartialType(CreateAnalysisDto) {}
