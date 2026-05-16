import { IsString, IsOptional, IsUUID, MaxLength } from 'class-validator';

export class CreateDocumentDto {
  @IsOptional()
  @IsUUID()
  projectId?: string;

  @IsOptional()
  @IsUUID()
  customerId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}
