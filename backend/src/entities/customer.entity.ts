import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { Contact } from './contact.entity';
import { Project } from './project.entity';
import { Email } from './email.entity';

@Entity('customers')
export class Customer extends BaseEntity {
  @Column({ name: 'company_name' })
  companyName: string;

  @Column({ nullable: true })
  industry: string;

  @Column({ nullable: true })
  website: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true, type: 'text' })
  address: string;

  @Column({ nullable: true, type: 'text' })
  notes: string;

  @Column({ type: 'simple-array', nullable: true })
  tags: string[];

  @Column({ name: 'created_by', nullable: true })
  createdById: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'created_by' })
  createdBy: User;

  @Column({ name: 'deleted_at', nullable: true })
  deletedAt: Date;

  @OneToMany(() => Contact, (contact) => contact.customer)
  contacts: Contact[];

  @OneToMany(() => Project, (project) => project.customer)
  projects: Project[];

  @OneToMany(() => Email, (email) => email.customer)
  emails: Email[];
}
