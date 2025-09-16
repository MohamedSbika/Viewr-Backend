import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { RoleAuth } from './role.entity';
import { UserProfileAuth } from './user-profile.entity';
import { EstablishmentAuth } from './establishment.entity';

@Entity('users')
export class UserAuth {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  phone_number: string;

  @Column({ default: false })
  is_verified: boolean;

  @ManyToMany(() => RoleAuth, role => role.users)
  @JoinTable({
    name: 'user_roles',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id'
    },
    inverseJoinColumn: {
      name: 'role_id',
      referencedColumnName: 'id'
    }
  })
  roles: RoleAuth[];

  @OneToOne(() => UserProfileAuth, userProfile => userProfile.user, { cascade: true })
  @JoinColumn()
  profile: UserProfileAuth;

  @ManyToOne(() => EstablishmentAuth, establishment => establishment.users)
  @JoinColumn({ name: 'establishment_id' })
  establishment: EstablishmentAuth;
}
