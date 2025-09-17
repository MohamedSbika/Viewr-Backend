import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { GENDER } from '@app/shared/shared-entities/enums/gender.enum';
import { UserAuth } from './user.entity';

@Entity('user_profiles')
export class UserProfileAuth {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  FirstName: string;

  @Column()
  LastName: string;

  @Column({ nullable: true })
  address: string;

  @Column({
    type: 'enum',
    enum: GENDER,
  })
  gender: GENDER;

  @Column({ nullable: true })
  CIN: string;

  @Column({ type: 'date' })
  DOB: Date;

  @Column('simple-array', { nullable: true })
  EducationDoc: string[];

  @OneToOne(() => UserAuth, user => user.profile)
  user: UserAuth;
}
