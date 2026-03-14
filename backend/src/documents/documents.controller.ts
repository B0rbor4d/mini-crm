import { Controller, Get, Post, Delete, Param, Query, UseGuards, UseInterceptors, UploadedFile, Res, Body, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes, ApiBody, ApiQuery } from '@nestjs/swagger';
import { Response } from 'express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { createReadStream } from 'fs';
import { join } from 'path';

// Allowed MIME types for upload
const ALLOWED_MIME_TYPES = [
  // Images
  'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
  // Documents
  'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  // Text
  'text/plain', 'text/csv', 'text/markdown',
  // Archives
  'application/zip', 'application/x-7z-compressed',
];

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

@ApiTags('documents')
@Controller('documents')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all documents' })
  @ApiResponse({ status: 200, description: 'List of documents' })
  @ApiQuery({ name: 'projectId', required: false })
  findAll(@Query('projectId') projectId?: string) {
    return this.documentsService.findAll(projectId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get document by ID' })
  @ApiResponse({ status: 200, description: 'Document found' })
  @ApiResponse({ status: 404, description: 'Document not found' })
  findOne(@Param('id') id: string) {
    return this.documentsService.findOne(id);
  }

  @Post('upload')
  @ApiOperation({ summary: 'Upload a document' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'File to upload (max 50MB)',
        },
        projectId: {
          type: 'string',
          description: 'Associated project ID',
        },
        category: {
          type: 'string',
          description: 'Document category',
        },
        description: {
          type: 'string',
          description: 'Document description',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Document uploaded' })
  @ApiResponse({ status: 400, description: 'Invalid file' })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: process.env.DOCUMENT_STORAGE_PATH || './uploads/documents',
        filename: (req, file, callback) => {
          const uniqueName = `${uuidv4()}${extname(file.originalname)}`;
          callback(null, uniqueName);
        },
      }),
      limits: {
        fileSize: MAX_FILE_SIZE,
      },
      fileFilter: (req, file, callback) => {
        if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
          callback(null, true);
        } else {
          callback(
            new BadRequestException(
              `Invalid file type: ${file.mimetype}. Allowed types: images, PDF, Office docs, text files, and archives.`
            ),
            false
          );
        }
      },
    })
  )
  upload(
    @UploadedFile() file: Express.Multer.File,
    @Body() createDocumentDto: CreateDocumentDto,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    return this.documentsService.upload(file, createDocumentDto);
  }

  @Get(':id/download')
  @ApiOperation({ summary: 'Download a document' })
  @ApiResponse({ status: 200, description: 'File download' })
  @ApiResponse({ status: 404, description: 'Document not found' })
  async download(@Param('id') id: string, @Res() res: Response) {
    const { file, document } = await this.documentsService.download(id);
    
    res.setHeader('Content-Type', document.mimeType || 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${document.originalName}"`);
    
    file.pipe(res);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a document' })
  @ApiResponse({ status: 200, description: 'Document deleted' })
  remove(@Param('id') id: string) {
    return this.documentsService.remove(id);
  }
}
