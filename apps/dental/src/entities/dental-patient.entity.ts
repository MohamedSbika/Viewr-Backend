import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { GENDER } from '@app/shared';
import { INSURANCE } from '@app/shared';
import { DentalAppointmentEntity } from './dental-appointment.entity';

@Entity('dental_patients')
export class DentalPatientEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  firstName: string;

  @Column({ type: 'varchar', length: 100 })
  lastName: string;

  @Column({ type: 'varchar', length: 100 })
  nationality: string;

  @Column({ type: 'varchar', length: 100 })
  city: string;

  @Column({ type: 'text' })
  address: string;

  @Column({ type: 'enum', enum: GENDER })
  gender: GENDER;

  @Column({ type: 'varchar', length: 50, unique: true })
  cin: string; // Identity card number

  @Column({ type: 'date' })
  dateOfBirth: Date;

  @Column({ type: 'enum', enum: INSURANCE, default: INSURANCE.CNAM })
  insuranceType: INSURANCE;

  @Column({ type: 'varchar', length: 100, nullable: true })
  insuranceId?: string;

  @Column({ type: 'varchar', length: 20 })
  phoneNumber: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  emergencyContact?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  emergencyPhone?: string;

  @Column({ type: 'json', nullable: true })
  medicalHistory?: string[];

  @Column({ type: 'json', nullable: true })
  allergies?: string[];

  @Column({ type: 'json', nullable: true })
  medications?: string[];

  @Column({ type: 'json', nullable: true })
  dentalChart?: Record<string, any>;

  @OneToMany(() => DentalAppointmentEntity, (appointment: DentalAppointmentEntity) => appointment.patient)
  appointments?: DentalAppointmentEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
