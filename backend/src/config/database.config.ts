import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../auth/entities/user.entity';
import { Customer } from '../customers/entities/customer.entity';
import { Contact } from '../customers/entities/contact.entity';
import { Project } from '../projects/entities/project.entity';
import { Document } from '../documents/entities/document.entity';
import { Task } from '../tasks/entities/task.entity';
import { Email } from '../emails/entities/email.entity';

export default registerAs('database', (): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
  username: process.env.POSTGRES_USER || 'crm_user',
  password: process.env.POSTGRES_PASSWORD || 'changeme',
  database: process.env.POSTGRES_DB || 'mini_crm',
  entities: [User, Customer, Contact, Project, Document, Task, Email],
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV === 'development',
}));
