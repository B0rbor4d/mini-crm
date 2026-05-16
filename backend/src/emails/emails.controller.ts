import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { EmailsService } from './emails.service';
import { ImapService } from './imap.service';
import { UpdateEmailDto, SyncEmailsDto } from './dto/update-email.dto';
import { QueryEmailsDto } from './dto/query-emails.dto';
import { Email } from '../entities/email.entity';

@Controller('emails')
@UseGuards(JwtAuthGuard)
export class EmailsController {
  constructor(
    private readonly emailsService: EmailsService,
    private readonly imapService: ImapService,
  ) {}

  @Get()
  async findAll(@Query() query: QueryEmailsDto) {
    return this.emailsService.findAll(query);
  }

  @Get('stats')
  async getStats() {
    return this.emailsService.getStats();
  }

  @Get('config/imap')
  async getImapConfig() {
    const config = await this.imapService.getConfig();
    if (!config) {
      return {
        host: '',
        port: 993,
        tls: true,
        user: '',
        hasPassword: false,
      };
    }
    return {
      host: config.host,
      port: config.port,
      tls: config.tls,
      user: config.user,
      hasPassword: !!config.password,
    };
  }

  @Post('config/imap')
  async updateImapConfig(@Body() config: { host: string; port: number; tls: boolean; user: string; password: string }) {
    await this.imapService.saveConfig({
      host: config.host,
      port: config.port,
      tls: config.tls,
      user: config.user,
      password: config.password,
    });
    return { success: true, message: 'IMAP-Konfiguration gespeichert' };
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Email> {
    return this.emailsService.findOne(id);
  }

  @Post('sync')
  async syncEmails(@Body() dto: SyncEmailsDto) {
    const result = await this.imapService.syncEmails(dto.folder, dto.limit);
    return { success: true, ...result };
  }

  @Post('test-connection')
  async testConnection() {
    return this.imapService.testConnection();
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateEmailDto): Promise<Email> {
    return this.emailsService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.emailsService.remove(id);
    return { success: true, message: 'Email deleted' };
  }
}
