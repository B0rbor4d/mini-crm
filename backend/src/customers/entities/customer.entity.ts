import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany } from 'typeorm';
import { Contact } from './contact.entity';

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  industry: string;

  @Column({ nullable: true })
  website: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  postalCode: string;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true, type: 'text' })
  notes: string;

  @Column({ default: 'active' })
  status: string;

  @Column({ nullable: true, type: 'simple-array' })
  tags: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(() => Contact, contact => contact.customer)
  contacts: Contact[];
}
