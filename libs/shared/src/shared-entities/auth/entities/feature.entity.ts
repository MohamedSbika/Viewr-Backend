import { RoleFeaturePermission } from './role-feature-permission.entity';

export class Feature {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  roleFeaturePermissions: RoleFeaturePermission[];
  createdAt: Date;
  updatedAt: Date;
}