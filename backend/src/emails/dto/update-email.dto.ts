import { IsString, IsOptional, IsUUID, IsBoolean } from 'class-validator';

export class UpdateEmailDto {
  @IsOptional()
  @IsUUID()
  customerId?: string;

  @IsOptional()
  @IsUUID()
  projectId?: string;

  @IsOptional()
  @IsBoolean()
  isRead?: boolean;
}

export class SyncEmailsDto {
  @IsOptional()
  @IsString()
  folder?: string;

  @IsOptional()
  limit?: number;
}
