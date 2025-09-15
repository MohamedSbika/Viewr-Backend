import { Role } from './role.entity';
import { Permission } from './permission.entity';
import { Feature } from './feature.entity';

export class RoleFeaturePermission {
  id: string;
  roleId: string;
  featureId: string;
  permissionId: string;
  role: Role;
  feature: Feature;
  permission: Permission;
}