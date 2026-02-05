import { IsString, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDocumentDto {
  @ApiPropertyOptional({ example: 'uuid-of-project' })
  @IsOptional()
  @IsUUID()
  projectId?: string;

  @ApiPropertyOptional({ example: 'contract' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ example: '/2024/contracts' })
  @IsOptional()
  @IsString()
  folderPath?: string;

  @ApiPropertyOptional({ example: 'Important contract document' })
  @IsOptional()
  @IsString()
  description?: string;
}
