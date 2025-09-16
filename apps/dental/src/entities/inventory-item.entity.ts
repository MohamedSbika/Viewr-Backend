import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { InventoryItemCategory } from '@app/shared';
import { StorageCondition } from '@app/shared';
import { Lot } from './lot.entity';
import type { Transaction } from './transaction.entity';

@Entity()
export class InventoryItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: InventoryItemCategory,
  })
  category: InventoryItemCategory;

  @Column()
  unit: string;

  @Column({
    type: 'enum',
    enum: StorageCondition,
  })
  storageCondition: StorageCondition;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: false })
  isConsumable: boolean;

  @Column({ default: false })
  isReusable: boolean;

  @OneToMany(() => Lot, (lot) => lot.inventoryItem)
  lots: Lot[];

  @OneToMany('Transaction', 'inventoryItem')
  transactions: Transaction[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
