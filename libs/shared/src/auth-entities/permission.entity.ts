import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { CRUD } from '@app/shared';
import { RoleFeaturePermissionAuth } from './role-feature-permission.entity';

@Entity('permissions')
export class PermissionAuth {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: CRUD,
  })
  action: CRUD;

  @OneToMany(() => RoleFeaturePermissionAuth, rfp => rfp.permission)
  roleFeaturePermissions: RoleFeaturePermissionAuth[];
}
