import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Email, EmailAttachment } from '../entities/email.entity';
import { ImapConfig } from '../entities/imap-config.entity';
import { EncryptionService } from './encryption.service';
import Imap = require('imap');
import { simpleParser } from 'mailparser';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

export interface ImapConnectionConfig {
  host: string;
  port: number;
  tls: boolean;
  user: string;
  password: string;
}

@Injectable()
export class ImapService {
  private readonly logger = new Logger(ImapService.name);
  private readonly storagePath: string;

  constructor(
    @InjectRepository(Email)
    private emailRepository: Repository<Email>,
    @InjectRepository(EmailAttachment)
    private attachmentRepository: Repository<EmailAttachment>,
    @InjectRepository(ImapConfig)
    private imapConfigRepository: Repository<ImapConfig>,
    private encryptionService: EncryptionService,
  ) {
    this.storagePath = process.env.EMAIL_STORAGE_PATH || './uploads/emails';
    if (!fs.existsSync(this.storagePath)) {
      fs.mkdirSync(this.storagePath, { recursive: true });
    }
  }

  async getConfig(): Promise<ImapConnectionConfig | null> {
    const config = await this.imapConfigRepository.findOne({
      where: { configKey: 'default' },
    });

    if (!config) return null;

    return {
      host: this.encryptionService.decryptValue(config.hostEncrypted) || '',
      port: config.port,
      tls: config.tls,
      user: this.encryptionService.decryptValue(config.userEncrypted) || '',
      password: this.encryptionService.decryptValue(config.passwordEncrypted) || '',
    };
  }

  async saveConfig(config: ImapConnectionConfig): Promise<void> {
    let existing = await this.imapConfigRepository.findOne({
      where: { configKey: 'default' },
    });

    const encryptedData = {
      hostEncrypted: this.encryptionService.encryptValue(config.host) || undefined,
      port: config.port,
      tls: config.tls,
      userEncrypted: this.encryptionService.encryptValue(config.user) || undefined,
      passwordEncrypted: this.encryptionService.encryptValue(config.password) || undefined,
      configKey: 'default',
    };

    if (existing) {
      await this.imapConfigRepository.update(existing.id, encryptedData);
    } else {
      const newConfig = this.imapConfigRepository.create(encryptedData);
      await this.imapConfigRepository.save(newConfig);
    }
  }

  async testConnection(): Promise<{ success: boolean; message: string }> {
    const config = await this.getConfig();
    if (!config || !config.host) {
      return { success: false, message: 'Keine IMAP-Konfiguration vorhanden' };
    }

    return new Promise((resolve) => {
      const imap = this.createImapConnection(config);
      
      imap.once('ready', () => {
        imap.end();
        resolve({ success: true, message: 'IMAP-Verbindung erfolgreich' });
      });

      imap.once('error', (err: Error) => {
        resolve({ success: false, message: err.message });
      });

      imap.connect();
    });
  }

  async syncEmails(folder = 'INBOX', limit = 50): Promise<{ synced: number; errors: number }> {
    const config = await this.getConfig();
    if (!config || !config.host) {
      throw new Error('Keine IMAP-Konfiguration vorhanden');
    }

    return new Promise((resolve, reject) => {
      const imap = this.createImapConnection(config);
      let synced = 0;
      let errors = 0;

      imap.once('ready', () => {
        imap.openBox(folder, true, (err) => {
          if (err) {
            imap.end();
            reject(err);
            return;
          }

          imap.search(['ALL'], (err, results) => {
            if (err) {
              imap.end();
              reject(err);
              return;
            }

            if (!results || results.length === 0) {
              imap.end();
              resolve({ synced: 0, errors: 0 });
              return;
            }

            const recentUids = results.slice(-limit);
            const fetch = imap.fetch(recentUids, { bodies: '', struct: true });

            fetch.on('message', (msg, seqno) => {
              let buffer = '';
              
              msg.on('body', (stream) => {
                stream.on('data', (chunk) => {
                  buffer += chunk.toString('utf8');
                });
              });

              msg.once('end', async () => {
                try {
                  await this.processEmail(buffer, folder);
                  synced++;
                } catch (err) {
                  this.logger.error(`Error processing email ${seqno}:`, err.message);
                  errors++;
                }
              });
            });

            fetch.once('error', (err) => {
              this.logger.error('Fetch error:', err);
              errors++;
            });

            fetch.once('end', () => {
              imap.end();
              resolve({ synced, errors });
            });
          });
        });
      });

      imap.once('error', (err: Error) => {
        reject(err);
      });

      imap.connect();
    });
  }

  private createImapConnection(config: ImapConnectionConfig): Imap {
    return new Imap({
      user: config.user,
      password: config.password,
      host: config.host,
      port: config.port,
      tls: config.tls,
      tlsOptions: { rejectUnauthorized: false },
    });
  }

  private async processEmail(rawEmail: string, folder: string): Promise<void> {
    const parsed = await simpleParser(rawEmail);
    const messageId = parsed.messageId || `generated-${uuidv4()}`;

    const existing = await this.emailRepository.findOne({
      where: { messageId },
    });

    if (existing) {
      this.logger.debug(`Email ${messageId} already synced`);
      return;
    }

    const email = this.emailRepository.create({
      messageId,
      subject: parsed.subject || '(Kein Betreff)',
      fromAddress: parsed.from?.value[0]?.address || '',
      fromName: parsed.from?.value[0]?.name || '',
      toAddresses: this.extractAddresses(parsed.to),
      ccAddresses: this.extractAddresses(parsed.cc),
      bodyText: parsed.text || '',
      bodyHtml: parsed.html || '',
      receivedAt: parsed.date || new Date(),
      folder,
      isSynced: true,
      syncedAt: new Date(),
    });

    const savedEmail = await this.emailRepository.save(email);

    if (parsed.attachments && parsed.attachments.length > 0) {
      for (const attachment of parsed.attachments) {
        await this.saveAttachment(savedEmail.id, attachment);
      }
    }
  }

  private extractAddresses(addressObj: any): string[] {
    if (!addressObj) return [];
    const addresses = Array.isArray(addressObj) ? addressObj : [addressObj];
    return addresses
      .flatMap((obj) => obj.value || [])
      .map((v: any) => v.address)
      .filter(Boolean);
  }

  private async saveAttachment(emailId: string, attachment: any): Promise<void> {
    const filename = attachment.filename || `attachment-${uuidv4()}`;
    const safeFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
    const storagePath = path.join(this.storagePath, `${uuidv4()}_${safeFilename}`);

    fs.writeFileSync(storagePath, attachment.content);

    const emailAttachment = this.attachmentRepository.create({
      emailId,
      filename: safeFilename,
      storagePath,
      mimeType: attachment.contentType || 'application/octet-stream',
      sizeBytes: attachment.size || 0,
    });

    await this.attachmentRepository.save(emailAttachment);
  }
}
