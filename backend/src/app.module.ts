import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CustomersModule } from './customers/customers.module';
import { ProjectsModule } from './projects/projects.module';
import { TasksModule } from './tasks/tasks.module';
import { DocumentsModule } from './documents/documents.module';
import { EmailsModule } from './emails/emails.module';
import { DashboardModule } from './dashboard/dashboard.module';
import {
  User,
  Customer,
  Contact,
  Project,
  ProjectMember,
  Document,
  Task,
  Email,
  EmailAttachment,
  ImapConfig,
} from './entities';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100,
    }]),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USER || 'waldseilgarten',
      password: process.env.DB_PASSWORD || 'changeme_secure_password',
      database: process.env.DB_NAME || 'waldseilgarten_crm',
      entities: [User, Customer, Contact, Project, ProjectMember, Document, Task, Email, EmailAttachment, ImapConfig],
      synchronize: false,
      logging: process.env.NODE_ENV === 'development',
    }),
    AuthModule,
    UsersModule,
    CustomersModule,
    ProjectsModule,
    TasksModule,
    DocumentsModule,
    EmailsModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
