import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { LotStatus } from '@app/shared';
import { StorageLocation } from './storage-location.entity';
import { Supplier } from './supplier.entity';
import { InventoryItem } from './inventory-item.entity';

@Entity()
export class Lot {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: true })
  inventoryItemId: string;

  @ManyToOne(() => InventoryItem, { eager: true, nullable: true })
  @JoinColumn({ name: 'inventoryItemId' })
  inventoryItem?: InventoryItem;

  @Column({ type: 'uuid' })
  supplierId: string;

  @ManyToOne(() => Supplier, { eager: true })
  @JoinColumn({ name: 'supplierId' })
  supplier: Supplier;

  @Column({ type: 'uuid' })
  storageLocationId: string;

  @ManyToOne(() => StorageLocation, { eager: true })
  @JoinColumn({ name: 'storageLocationId' })
  storageLocation: StorageLocation;
  @Column({ type: 'timestamp' })
  receiveDate: Date;

  @Column({ type: 'timestamp' })
  expiryDate: Date;

  @Column()
  quantity: number;

  @Column({ type: 'timestamp', nullable: true })
  lastCheckedDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  lastUsedDate: Date;

  @Column({
    type: 'enum',
    enum: LotStatus,
    default: LotStatus.AVAILABLE,
  })
  status: LotStatus;

  @Column()
  location: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
