export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
}

export interface Customer {
  id: string;
  companyName: string;
  industry?: string;
  website?: string;
  phone?: string;
  email?: string;
  address?: string;
  notes?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Document {
  id: string;
  name: string;
  originalName: string;
  mimeType?: string;
  sizeBytes?: number;
  version?: number;
  projectId?: string;
  customerId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'open' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  projectId?: string;
  assignedToId?: string;
  createdById?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EmailAttachment {
  id: string;
  filename: string;
  mimeType?: string;
  sizeBytes?: number;
}

export interface Email {
  id: string;
  messageId?: string;
  subject?: string;
  fromAddress?: string;
  fromName?: string;
  toAddresses?: string[];
  ccAddresses?: string[];
  bodyText?: string;
  bodyHtml?: string;
  receivedAt?: string;
  isRead: boolean;
  isSynced: boolean;
  folder: string;
  customerId?: string;
  projectId?: string;
  customer?: Customer;
  project?: { id: string; name: string };
  attachments?: EmailAttachment[];
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
