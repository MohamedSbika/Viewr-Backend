import { SafePartialType } from '@app/shared';
import { CreateRoleDto } from './create-role.dto';

export class UpdateRoleDto extends SafePartialType(CreateRoleDto) {}