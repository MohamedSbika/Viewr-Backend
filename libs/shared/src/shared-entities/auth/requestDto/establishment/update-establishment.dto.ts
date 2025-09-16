import { SafePartialType as PartialType } from '@app/shared';
import { CreateEstablishmentDto } from './create-establishment.dto';

export class UpdateEstablishmentDto extends PartialType(CreateEstablishmentDto) {}