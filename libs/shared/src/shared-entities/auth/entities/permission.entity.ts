import { CRUD } from '@app/shared';
import { RoleFeaturePermission } from './role-feature-permission.entity';

export class Permission {
  id: string;
  action: CRUD;
  roleFeaturePermissions: RoleFeaturePermission[];
}