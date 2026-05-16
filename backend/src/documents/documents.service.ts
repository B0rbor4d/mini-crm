import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from '../entities/document.entity';
import { createWriteStream, existsSync, mkdirSync, createReadStream } from 'fs';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import archiver from 'archiver';

@Injectable()
export class DocumentsService {
  private readonly uploadDir = join(process.cwd(), 'uploads');

  constructor(
    @InjectRepository(Document)
    private documentRepository: Repository<Document>,
  ) {
    if (!existsSync(this.uploadDir)) {
      mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async uploadFile(
    file: Express.Multer.File,
    userId: string,
    projectId?: string,
    customerId?: string,
  ): Promise<Document> {
    const fileExtension = file.originalname.split('.').pop();
    const fileName = `${uuidv4()}.${fileExtension}`;
    const filePath = join(this.uploadDir, fileName);

    await new Promise<void>((resolve, reject) => {
      const writeStream = createWriteStream(filePath);
      writeStream.write(file.buffer);
      writeStream.end();
      writeStream.on('finish', () => resolve());
      writeStream.on('error', reject);
    });

    const document = this.documentRepository.create({
      name: fileName,
      originalName: file.originalname,
      storagePath: filePath,
      mimeType: file.mimetype,
      sizeBytes: file.size,
      projectId,
      customerId,
      uploadedById: userId,
    });

    return this.documentRepository.save(document);
  }

  async createVersion(
    originalDocumentId: string,
    file: Express.Multer.File,
    userId: string,
  ): Promise<Document> {
    const originalDoc = await this.findOne(originalDocumentId);
    
    const fileExtension = file.originalname.split('.').pop();
    const fileName = `${uuidv4()}.${fileExtension}`;
    const filePath = join(this.uploadDir, fileName);

    await new Promise<void>((resolve, reject) => {
      const writeStream = createWriteStream(filePath);
      writeStream.write(file.buffer);
      writeStream.end();
      writeStream.on('finish', () => resolve());
      writeStream.on('error', reject);
    });

    const document = this.documentRepository.create({
      name: fileName,
      originalName: file.originalname,
      storagePath: filePath,
      mimeType: file.mimetype,
      sizeBytes: file.size,
      projectId: originalDoc.projectId,
      customerId: originalDoc.customerId,
      uploadedById: userId,
      version: originalDoc.version + 1,
      previousVersionId: originalDocumentId,
    });

    return this.documentRepository.save(document);
  }

  async getVersions(documentId: string): Promise<Document[]> {
    const document = await this.findOne(documentId);
    
    // Find all versions of this document chain
    const versions = await this.documentRepository.find({
      where: [
        { id: documentId },
        { previousVersionId: documentId },
      ],
      order: { version: 'DESC' },
    });

    return versions;
  }

  async findAll(query: { page?: number; limit?: number; projectId?: string; customerId?: string } = {}): Promise<{ data: Document[]; total: number; page: number; limit: number }> {
    const { page = 1, limit = 10, projectId, customerId } = query;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (projectId) where.projectId = projectId;
    if (customerId) where.customerId = customerId;

    const [data, total] = await this.documentRepository.findAndCount({
      where,
      relations: ['project', 'customer', 'uploadedBy'],
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return { data, total, page, limit };
  }

  async findOne(id: string): Promise<Document> {
    const document = await this.documentRepository.findOne({
      where: { id },
      relations: ['project', 'customer', 'uploadedBy'],
    });

    if (!document) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }

    return document;
  }

  async createZip(documentIds: string[]): Promise<NodeJS.ReadableStream> {
    const archive = archiver('zip', { zlib: { level: 9 } });
    
    for (const id of documentIds) {
      try {
        const document = await this.findOne(id);
        if (existsSync(document.storagePath)) {
          archive.file(document.storagePath, { name: document.originalName });
        }
      } catch (error) {
        // Skip documents that don't exist
        continue;
      }
    }

    archive.finalize();
    return archive;
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.documentRepository.delete(id);
  }
}
