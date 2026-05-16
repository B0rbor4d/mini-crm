import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { Customer } from './customer.entity';
import { ProjectMember } from './project-member.entity';
import { Email } from './email.entity';

export enum ProjectStatus {
  NEW = 'new',
  IN_PROGRESS = 'in_progress',
  ON_HOLD = 'on_hold',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum ProjectPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

@Entity('projects')
export class Project extends BaseEntity {
  @Column()
  name: string;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @Column({ name: 'customer_id', nullable: true })
  customerId: string;

  @ManyToOne(() => Customer, (customer) => customer.projects, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @Column({
    type: 'enum',
    enum: ProjectStatus,
    default: ProjectStatus.NEW,
  })
  status: ProjectStatus;

  @Column({
    type: 'enum',
    enum: ProjectPriority,
    default: ProjectPriority.MEDIUM,
  })
  priority: ProjectPriority;

  @Column({ name: 'start_date', nullable: true, type: 'date' })
  startDate: Date;

  @Column({ name: 'end_date', nullable: true, type: 'date' })
  endDate: Date;

  @Column({ nullable: true, type: 'decimal', precision: 12, scale: 2 })
  budget: number;

  @Column({ name: 'created_by', nullable: true })
  createdById: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'created_by' })
  createdBy: User;

  @OneToMany(() => ProjectMember, (member) => member.project)
  members: ProjectMember[];

  @OneToMany(() => Email, (email) => email.project)
  emails: Email[];
}
