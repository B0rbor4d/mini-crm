import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task, TaskStatus } from '../entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async create(createTaskDto: CreateTaskDto, userId: string): Promise<Task> {
    const task = this.taskRepository.create({
      ...createTaskDto,
      createdById: userId,
    });
    return this.taskRepository.save(task);
  }

  async findAll(query: { 
    page?: number; 
    limit?: number; 
    status?: TaskStatus; 
    projectId?: string;
    assignedToId?: string;
  } = {}): Promise<{ data: Task[]; total: number; page: number; limit: number }> {
    const { page = 1, limit = 10, status, projectId, assignedToId } = query;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) where.status = status;
    if (projectId) where.projectId = projectId;
    if (assignedToId) where.assignedToId = assignedToId;

    const [data, total] = await this.taskRepository.findAndCount({
      where,
      relations: ['project', 'assignedTo', 'createdBy'],
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return { data, total, page, limit };
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['project', 'assignedTo', 'createdBy'],
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOne(id);
    
    // If status changes to done, set completedAt
    if (updateTaskDto.status === TaskStatus.DONE && task.status !== TaskStatus.DONE) {
      task.completedAt = new Date();
    }
    
    Object.assign(task, updateTaskDto);
    return this.taskRepository.save(task);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.taskRepository.delete(id);
  }

  async getKanbanBoard(projectId?: string): Promise<Record<string, Task[]>> {
    const where: any = {};
    if (projectId) where.projectId = projectId;

    const tasks = await this.taskRepository.find({
      where,
      relations: ['project', 'assignedTo', 'createdBy'],
      order: { createdAt: 'DESC' },
    });

    const columns: Record<string, Task[]> = {
      open: [],
      in_progress: [],
      review: [],
      done: [],
    };

    tasks.forEach(task => {
      if (columns[task.status]) {
        columns[task.status].push(task);
      }
    });

    return columns;
  }
}
