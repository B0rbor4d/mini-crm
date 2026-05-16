import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, IsNull } from 'typeorm';
import { Email, EmailAttachment } from '../entities/email.entity';
import { UpdateEmailDto } from './dto/update-email.dto';
import { QueryEmailsDto } from './dto/query-emails.dto';

@Injectable()
export class EmailsService {
  constructor(
    @InjectRepository(Email)
    private emailRepository: Repository<Email>,
    @InjectRepository(EmailAttachment)
    private attachmentRepository: Repository<EmailAttachment>,
  ) {}

  async findAll(query: QueryEmailsDto): Promise<{ data: Email[]; total: number; page: number; limit: number }> {
    const { page = 1, limit = 20, search, customerId, projectId, isRead, folder } = query;
    const skip = (page - 1) * limit;

    const where: any = {};
    
    if (customerId) where.customerId = customerId;
    if (projectId) where.projectId = projectId;
    if (isRead !== undefined) where.isRead = isRead;
    if (folder) where.folder = folder;
    
    if (search) {
      where.subject = Like(`%${search}%`);
    }

    const [data, total] = await this.emailRepository.findAndCount({
      where,
      relations: ['attachments', 'customer', 'project'],
      order: { receivedAt: 'DESC' },
      skip,
      take: limit,
    });

    return { data, total, page, limit };
  }

  async findOne(id: string): Promise<Email> {
    const email = await this.emailRepository.findOne({
      where: { id },
      relations: ['attachments', 'customer', 'project'],
    });

    if (!email) {
      throw new NotFoundException(`Email with ID ${id} not found`);
    }

    return email;
  }

  async update(id: string, dto: UpdateEmailDto): Promise<Email> {
    const email = await this.findOne(id);
    
    if (dto.customerId !== undefined) {
      email.customerId = dto.customerId;
    }
    if (dto.projectId !== undefined) {
      email.projectId = dto.projectId;
    }
    if (dto.isRead !== undefined) {
      email.isRead = dto.isRead;
    }

    return this.emailRepository.save(email);
  }

  async remove(id: string): Promise<void> {
    const email = await this.findOne(id);
    await this.emailRepository.remove(email);
  }

  async getStats(): Promise<{ total: number; unread: number; synced: number; unassigned: number }> {
    const [total, unread, synced, unassigned] = await Promise.all([
      this.emailRepository.count(),
      this.emailRepository.count({ where: { isRead: false } }),
      this.emailRepository.count({ where: { isSynced: true } }),
      this.emailRepository.count({ where: { customerId: IsNull(), projectId: IsNull() } }),
    ]);

    return { total, unread, synced, unassigned };
  }
}
