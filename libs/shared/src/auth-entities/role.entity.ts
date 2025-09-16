import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany } from 'typeorm';
import { UserAuth } from './user.entity';
import { RoleFeaturePermissionAuth } from './role-feature-permission.entity';

@Entity('roles')
export class RoleAuth {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @ManyToMany(() => UserAuth, user => user.roles)
  users: UserAuth[];

  @OneToMany(() => RoleFeaturePermissionAuth, rfp => rfp.role)
  roleFeaturePermissions: RoleFeaturePermissionAuth[];
}
