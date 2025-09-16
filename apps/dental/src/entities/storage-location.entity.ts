import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { StorageLocationStatus } from '@app/shared';

@Entity()
export class StorageLocation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  locationName: string;

  @Column({
    type: 'enum',
    enum: StorageLocationStatus,
    default: StorageLocationStatus.ACTIVE,
  })
  status: StorageLocationStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
