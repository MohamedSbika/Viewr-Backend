import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { RoleAuth } from './role.entity';
import { PermissionAuth } from './permission.entity';
import { FeatureAuth } from './feature.entity';

@Entity('role_feature_permissions')
export class RoleFeaturePermissionAuth {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'role_id' })
  roleId: string;

  @Column({ name: 'feature_id' })
  featureId: string;

  @Column({ name: 'permission_id' })
  permissionId: string;
  
  @ManyToOne(() => RoleAuth, role => role.roleFeaturePermissions)
  @JoinColumn({ name: 'role_id' })
  role: RoleAuth;

  @ManyToOne(() => FeatureAuth, feature => feature.roleFeaturePermissions)
  @JoinColumn({ name: 'feature_id' })
  feature: FeatureAuth;

  @ManyToOne(() => PermissionAuth, permission => permission.roleFeaturePermissions)
  @JoinColumn({ name: 'permission_id' })
  permission: PermissionAuth;
}
