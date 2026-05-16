import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, IsNull } from 'typeorm';
import { Customer } from '../entities/customer.entity';
import { Contact } from '../entities/contact.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CreateContactDto } from './dto/create-contact.dto';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    @InjectRepository(Contact)
    private contactRepository: Repository<Contact>,
  ) {}

  async create(createCustomerDto: CreateCustomerDto, userId: string): Promise<Customer> {
    const customer = this.customerRepository.create({
      ...createCustomerDto,
      createdById: userId,
    });
    return this.customerRepository.save(customer);
  }

  async findAll(query: { search?: string; page?: number; limit?: number } = {}): Promise<{ data: Customer[]; total: number; page: number; limit: number }> {
    const { search, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const where: any = { deletedAt: IsNull() };
    if (search) {
      where.companyName = Like(`%${search}%`);
    }

    const [data, total] = await this.customerRepository.findAndCount({
      where,
      relations: ['contacts'],
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return { data, total, page, limit };
  }

  async findOne(id: string): Promise<Customer> {
    const customer = await this.customerRepository.findOne({
      where: { id, deletedAt: IsNull() },
      relations: ['contacts', 'projects'],
    });

    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    return customer;
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto): Promise<Customer> {
    const customer = await this.findOne(id);
    Object.assign(customer, updateCustomerDto);
    return this.customerRepository.save(customer);
  }

  async remove(id: string): Promise<void> {
    const customer = await this.findOne(id);
    customer.deletedAt = new Date();
    await this.customerRepository.save(customer);
  }

  async createContact(customerId: string, createContactDto: CreateContactDto): Promise<Contact> {
    await this.findOne(customerId);
    const contact = this.contactRepository.create({
      ...createContactDto,
      customerId,
    });
    return this.contactRepository.save(contact);
  }

  async findContacts(customerId: string): Promise<Contact[]> {
    return this.contactRepository.find({
      where: { customerId },
      order: { createdAt: 'DESC' },
    });
  }
}
