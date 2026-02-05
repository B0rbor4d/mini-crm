import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from '../customers/entities/customer.entity';
import { Project, ProjectStatus } from '../projects/entities/project.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) {}

  async getStats() {
    const totalCustomers = await this.customerRepository.count();
    const totalProjects = await this.projectRepository.count();
    
    const activeProjects = await this.projectRepository.count({
      where: { status: ProjectStatus.ACTIVE },
    });
    
    const completedProjects = await this.projectRepository.count({
      where: { status: ProjectStatus.COMPLETED },
    });

    const recentCustomers = await this.customerRepository.find({
      order: { createdAt: 'DESC' },
      take: 5,
    });

    const recentProjects = await this.projectRepository.find({
      relations: ['customer'],
      order: { createdAt: 'DESC' },
      take: 5,
    });

    return {
      counts: {
        totalCustomers,
        totalProjects,
        activeProjects,
        completedProjects,
      },
      recentCustomers,
      recentProjects,
    };
  }
}
