import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class EncryptionService {
  private readonly algorithm = 'aes-256-gcm';
  private readonly key: Buffer;

  constructor(private configService: ConfigService) {
    const secret = this.configService.get('ENCRYPTION_KEY') || this.configService.get('JWT_SECRET') || '';
    // Derive 32-byte key from secret using SHA-256
    this.key = crypto.createHash('sha256').update(secret).digest();
  }

  encrypt(text: string): { encrypted: string; iv: string; tag: string } {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const tag = cipher.getAuthTag();
    
    return {
      encrypted,
      iv: iv.toString('hex'),
      tag: tag.toString('hex'),
    };
  }

  decrypt(encrypted: string, iv: string, tag: string): string {
    const decipher = crypto.createDecipheriv(
      this.algorithm,
      this.key,
      Buffer.from(iv, 'hex')
    );
    
    decipher.setAuthTag(Buffer.from(tag, 'hex'));
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }

  encryptValue(text: string | null): string | null {
    if (!text) return null;
    const result = this.encrypt(text);
    return JSON.stringify(result);
  }

  decryptValue(encryptedJson: string | null): string | null {
    if (!encryptedJson) return null;
    try {
      const { encrypted, iv, tag } = JSON.parse(encryptedJson);
      return this.decrypt(encrypted, iv, tag);
    } catch {
      return null;
    }
  }
}
