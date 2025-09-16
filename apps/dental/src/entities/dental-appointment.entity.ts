import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { DENTAL_APPOINTMENT_STATUS } from '@app/shared';
import { DentalPatientEntity } from './dental-patient.entity';

@Entity('dental_appointments')
export class DentalAppointmentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamp' })
  startTime: Date;

  @Column({ type: 'timestamp' })
  endTime: Date;

  @Column({ type: 'enum', enum: DENTAL_APPOINTMENT_STATUS, default: DENTAL_APPOINTMENT_STATUS.PENDING })
  status: DENTAL_APPOINTMENT_STATUS;

  @Column({ type: 'varchar', length: 100 })
  appointmentType: string; // e.g., 'consultation', 'cleaning', 'filling', 'extraction'

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ type: 'text', nullable: true })
  treatmentPlan?: string;

  @Column({ type: 'text', nullable: true })
  diagnosis?: string;

  @Column({ type: 'json', nullable: true })
  proceduresConducted?: string[];

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  totalAmount?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  paidAmount?: number;

  @ManyToOne(() => DentalPatientEntity, patient => patient.appointments, { eager: true })
  @JoinColumn({ name: 'patientId' })
  patient: DentalPatientEntity;

  @Column({ type: 'uuid' })
  patientId: string;

  @Column({ type: 'uuid' })
  dentistId: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  roomNumber?: string;

  @Column({ type: 'boolean', default: false })
  followUpRequired?: boolean;

  @Column({ type: 'timestamp', nullable: true })
  followUpDate?: Date;

  @Column({ type: 'json', nullable: true })
  prescriptions?: string[];

  @Column({ type: 'json', nullable: true })
  xrayUrls?: string[];

  @Column({ type: 'json', nullable: true })
  dentalPhotos?: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
