import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from './entities/document.entity';
import { CreateDocumentDto } from './dto/create-document.dto';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

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

  async findAll(projectId?: string) {
    const where = projectId ? { projectId } : {};
    return this.documentRepository.find({
      where,
      relations: ['project'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    const document = await this.documentRepository.findOne({
      where: { id },
      relations: ['project'],
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    return document;
  }

  async upload(file: Express.Multer.File, createDocumentDto: CreateDocumentDto) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const fileId = uuidv4();
    const fileExtension = path.extname(file.originalname);
    const storageFileName = `${fileId}${fileExtension}`;
    const storagePath = path.join(this.uploadPath, storageFileName);

    // Save file to disk
    fs.writeFileSync(storagePath, file.buffer);

    // Create database record
    const document = this.documentRepository.create({
      name: file.originalname,
      originalName: file.originalname,
      storagePath: storageFileName,
      mimeType: file.mimetype,
      sizeBytes: file.size,
      projectId: createDocumentDto.projectId,
      category: createDocumentDto.category,
      folderPath: createDocumentDto.folderPath || '/',
      uploadedBy: 'system', // TODO: Get from auth context
      metadata: {
        description: createDocumentDto.description,
      },
    });

    return this.documentRepository.save(document);
  }

  async download(id: string) {
    const document = await this.findOne(id);
    const filePath = path.join(this.uploadPath, document.storagePath);

    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('File not found on disk');
    }

    const file = fs.createReadStream(filePath);
    return { file, document };
  }

  async update(id: string, updateData: Partial<CreateDocumentDto>) {
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

  async remove(id: string) {
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
