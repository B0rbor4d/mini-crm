import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailsService } from './emails.service';
import { ImapService } from './imap.service';
import { EncryptionService } from './encryption.service';
import { EmailsController } from './emails.controller';
import { Email, EmailAttachment } from '../entities/email.entity';
import { ImapConfig } from '../entities/imap-config.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Email, EmailAttachment, ImapConfig]), AuthModule],
  providers: [EmailsService, ImapService, EncryptionService],
  controllers: [EmailsController],
  exports: [EmailsService, ImapService, EncryptionService],
})
export class EmailsModule {}
