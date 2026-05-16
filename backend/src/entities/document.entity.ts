import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Project } from './project.entity';
import { Customer } from './customer.entity';
import { User } from './user.entity';

@Entity('documents')
export class Document extends BaseEntity {
  @Column()
  name: string;

  @Column({ name: 'original_name' })
  originalName: string;

  @Column({ name: 'storage_path' })
  storagePath: string;

  @Column({ name: 'mime_type', nullable: true })
  mimeType: string;

  @Column({ name: 'size_bytes', type: 'bigint', nullable: true })
  sizeBytes: number;

  @Column({ name: 'project_id', nullable: true })
  projectId: string;

  @ManyToOne(() => Project, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @Column({ name: 'customer_id', nullable: true })
  customerId: string;

  @ManyToOne(() => Customer, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @Column({ name: 'uploaded_by', nullable: true })
  uploadedById: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'uploaded_by' })
  uploadedBy: User;

  @Column({ default: 1 })
  version: number;

  @Column({ name: 'previous_version_id', nullable: true })
  previousVersionId: string;
}
