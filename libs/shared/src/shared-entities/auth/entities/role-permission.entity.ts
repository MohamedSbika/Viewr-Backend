import { Role } from './role.entity';
import { Permission } from './permission.entity';
import { Feature } from './feature.entity';

export class RolePermission {
  id: string;
  idRole: string;
  idPermission: string;
  idFeature: string;
  role: Role;
  permission: Permission;
  feature: Feature;
}