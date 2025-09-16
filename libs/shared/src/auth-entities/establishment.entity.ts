import { Entity, PrimaryColumn, Column, OneToMany, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { UserAuth } from './user.entity';
import { PlanAuth } from './plan.entity';

@Entity('establishments')
export class EstablishmentAuth {
  @PrimaryColumn()
  id: string;

  @Column({ name: 'name' })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  longitude: string;

  @Column({ nullable: true })
  latitude: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ name: 'plan_id', nullable: true })
  planId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => UserAuth, user => user.establishment)
  users: UserAuth[];

  @ManyToOne(() => PlanAuth, plan => plan.establishments)
  @JoinColumn({ name: 'plan_id' })
  plan: PlanAuth;
}
