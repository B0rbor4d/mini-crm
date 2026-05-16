import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Customer } from './customer.entity';
import { Project } from './project.entity';
import { User } from './user.entity';

@Entity('emails')
export class Email extends BaseEntity {
  @Column({ name: 'message_id', type: 'varchar', length: 500, unique: true, nullable: true })
  messageId: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  subject: string;

  @Column({ name: 'from_address', type: 'varchar', length: 255, nullable: true })
  fromAddress: string;

  @Column({ name: 'from_name', type: 'varchar', length: 255, nullable: true })
  fromName: string;

  @Column({ name: 'to_addresses', type: 'simple-array', nullable: true })
  toAddresses: string[];

  @Column({ name: 'cc_addresses', type: 'simple-array', nullable: true })
  ccAddresses: string[];

  @Column({ name: 'body_text', type: 'text', nullable: true })
  bodyText: string;

  @Column({ name: 'body_html', type: 'text', nullable: true })
  bodyHtml: string;

  @Column({ name: 'received_at', type: 'timestamp', nullable: true })
  receivedAt: Date;

  @Column({ name: 'is_read', type: 'boolean', default: false })
  isRead: boolean;

  @Column({ name: 'is_synced', type: 'boolean', default: false })
  isSynced: boolean;

  @Column({ name: 'synced_at', type: 'timestamp', nullable: true })
  syncedAt: Date;

  @Column({ name: 'folder', type: 'varchar', length: 100, default: 'INBOX' })
  folder: string;

  @ManyToOne(() => Customer, customer => customer.emails, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @Column({ name: 'customer_id', type: 'uuid', nullable: true })
  customerId: string;

  @ManyToOne(() => Project, project => project.emails, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @Column({ name: 'project_id', type: 'uuid', nullable: true })
  projectId: string;

  @OneToMany(() => EmailAttachment, attachment => attachment.email, { cascade: true })
  attachments: EmailAttachment[];
}

@Entity('email_attachments')
export class EmailAttachment extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  filename: string;

  @Column({ name: 'storage_path', type: 'varchar', length: 500 })
  storagePath: string;

  @Column({ name: 'mime_type', type: 'varchar', length: 100, nullable: true })
  mimeType: string;

  @Column({ name: 'size_bytes', type: 'bigint', nullable: true })
  sizeBytes: number;

  @ManyToOne(() => Email, email => email.attachments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'email_id' })
  email: Email;

  @Column({ name: 'email_id', type: 'uuid' })
  emailId: string;
}
