import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('imap_configs')
export class ImapConfig {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  hostEncrypted: string | null;

  @Column({ type: 'int', default: 993 })
  port: number;

  @Column({ type: 'boolean', default: true })
  tls: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  userEncrypted: string | null;

  @Column({ type: 'text', nullable: true })
  passwordEncrypted: string | null;

  @Column({ type: 'varchar', length: 100, default: 'default' })
  configKey: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
