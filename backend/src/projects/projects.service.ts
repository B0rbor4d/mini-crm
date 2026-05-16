import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../entities/project.entity';
import { ProjectMember } from '../entities/project-member.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(ProjectMember)
    private projectMemberRepository: Repository<ProjectMember>,
  ) {}

  async create(createProjectDto: CreateProjectDto, userId: string): Promise<Project> {
    const project = this.projectRepository.create({
      ...createProjectDto,
      createdById: userId,
    });
    return this.projectRepository.save(project);
  }

  async findAll(query: { page?: number; limit?: number } = {}): Promise<{ data: Project[]; total: number; page: number; limit: number }> {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const [data, total] = await this.projectRepository.findAndCount({
      relations: ['customer', 'members', 'members.user'],
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return { data, total, page, limit };
  }

  async findOne(id: string): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ['customer', 'members', 'members.user'],
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    return project;
  }

  async update(id: string, updateProjectDto: UpdateProjectDto): Promise<Project> {
    const project = await this.findOne(id);
    Object.assign(project, updateProjectDto);
    return this.projectRepository.save(project);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.projectRepository.delete(id);
  }

  async addMember(projectId: string, userId: string, role: string = 'member'): Promise<ProjectMember> {
    await this.findOne(projectId);
    const member = this.projectMemberRepository.create({
      projectId,
      userId,
      role,
    });
    return this.projectMemberRepository.save(member);
  }

  async removeMember(projectId: string, userId: string): Promise<void> {
    await this.projectMemberRepository.delete({ projectId, userId });
  }
}
