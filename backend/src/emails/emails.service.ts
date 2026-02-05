import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Email } from './entities/email.entity';
import { EmailFilterDto } from './dto/email.dto';

@Injectable()
export class EmailsService {
  constructor(
    @InjectRepository(Email)
    private emailRepository: Repository<Email>,
  ) {}

  async findAll(filters: EmailFilterDto) {
    const where: any = {};
    
    if (filters.projectId) {
      where.projectId = filters.projectId;
    }
    
    if (filters.unreadOnly) {
      where.isRead = false;
    }

    return this.emailRepository.find({
      where,
      relations: ['project'],
      order: { sentAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    const email = await this.emailRepository.findOne({
      where: { id },
      relations: ['project'],
    });

    if (!email) {
      throw new NotFoundException('Email not found');
    }

    return email;
  }

  async assignToProject(id: string, projectId: string) {
    const email = await this.findOne(id);
    email.projectId = projectId;
    return this.emailRepository.save(email);
  }

  async markAsRead(id: string) {
    const email = await this.findOne(id);
    email.isRead = true;
    return this.emailRepository.save(email);
  }

  // Called by IMAP worker
  async createOrUpdate(emailData: Partial<Email>) {
    const existing = await this.emailRepository.findOne({
      where: { messageId: emailData.messageId },
    });

    if (existing) {
      return existing;
    }

    const email = this.emailRepository.create(emailData);
    return this.emailRepository.save(email);
  }
}
