import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from './entities/document.entity';
import { CreateDocumentDto } from './dto/create-document.dto';
import * as fs from 'fs';
import * as path from 'path';
import { createReadStream } from 'fs';
import { join } from 'path';

@Injectable()
export class DocumentsService {
  private readonly uploadPath: string;

  constructor(
    @InjectRepository(Document)
    private documentRepository: Repository<Document>,
  ) {
    this.uploadPath = process.env.DOCUMENT_STORAGE_PATH || './uploads/documents';
    this.ensureUploadPath();
  }

  private ensureUploadPath() {
    if (!fs.existsSync(this.uploadPath)) {
      fs.mkdirSync(this.uploadPath, { recursive: true });
    }
  }

  async findAll(projectId?: string): Promise<Document[]> {
    const where = projectId ? { projectId } : {};
    return this.documentRepository.find({
      where,
      relations: ['project'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Document> {
    const document = await this.documentRepository.findOne({
      where: { id },
      relations: ['project'],
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    return document;
  }

  async upload(
    file: Express.Multer.File,
    createDocumentDto: CreateDocumentDto,
    uploadedBy = 'system'
  ): Promise<Document> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    // Create database record
    const document = this.documentRepository.create({
      name: file.originalname,
      originalName: file.originalname,
      storagePath: file.filename, // Already UUID-based from multer
      mimeType: file.mimetype,
      sizeBytes: file.size,
      projectId: createDocumentDto.projectId || null,
      category: createDocumentDto.category,
      folderPath: createDocumentDto.folderPath || '/',
      uploadedBy,
      metadata: {
        description: createDocumentDto.description,
      },
    });

    return this.documentRepository.save(document);
  }

  async download(id: string): Promise<{ file: fs.ReadStream; document: Document }> {
    const document = await this.findOne(id);
    const filePath = path.join(this.uploadPath, document.storagePath);

    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('File not found on disk');
    }

    const file = createReadStream(filePath);
    return { file, document };
  }

  async update(id: string, updateData: Partial<CreateDocumentDto>): Promise<Document> {
    const document = await this.findOne(id);
    
    if (updateData.projectId !== undefined) {
      document.projectId = updateData.projectId;
    }
    if (updateData.category !== undefined) {
      document.category = updateData.category;
    }
    if (updateData.folderPath !== undefined) {
      document.folderPath = updateData.folderPath;
    }
    if (updateData.description !== undefined) {
      document.metadata = { ...document.metadata, description: updateData.description };
    }

    return this.documentRepository.save(document);
  }

  async remove(id: string): Promise<{ message: string }> {
    const document = await this.findOne(id);
    const filePath = path.join(this.uploadPath, document.storagePath);

    // Delete file from disk
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete database record
    await this.documentRepository.remove(document);
    return { message: 'Document deleted successfully' };
  }
}
