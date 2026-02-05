import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { Customer } from '../customers/entities/customer.entity';
import { Project } from '../projects/entities/project.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Customer, Project])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
