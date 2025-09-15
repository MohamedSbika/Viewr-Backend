import { User } from './user.entity';
import { RoleFeaturePermission } from './role-feature-permission.entity';

export class Role {
  id: string;
  title: string;
  users: User[];
  roleFeaturePermissions: RoleFeaturePermission[];
}