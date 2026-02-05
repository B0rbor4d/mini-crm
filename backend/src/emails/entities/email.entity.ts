import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Project } from '../../projects/entities/project.entity';

@Entity('emails')
export class Email {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  messageId: string;

  @Column()
  subject: string;

  @Column({ type: 'text' })
  body: string;

  @Column()
  fromAddress: string;

  @Column()
  fromName: string;

  @Column('simple-array')
  toAddresses: string[];

  @Column({ type: 'simple-array', nullable: true })
  ccAddresses: string[];

  @Column({ type: 'timestamp' })
  sentAt: Date;

  @Column({ default: false })
  isRead: boolean;

  @Column({ nullable: true })
  projectId: string;

  @ManyToOne(() => Project, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'projectId' })
  project: Project;

  @Column({ type: 'jsonb', nullable: true })
  attachments: {
    filename: string;
    size: number;
    contentType: string;
  }[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
