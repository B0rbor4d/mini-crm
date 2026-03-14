import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, ILike } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { Contact } from './entities/contact.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CreateContactDto } from './dto/create-contact.dto';

export interface FindAllOptions {
  search?: string;
  status?: string;
  tags?: string[];
  skip?: number;
  take?: number;
}

export interface PaginatedCustomers {
  data: Customer[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    @InjectRepository(Contact)
    private contactRepository: Repository<Contact>,
  ) {}

  async findAll(options: FindAllOptions = {}): Promise<PaginatedCustomers> {
    const { search, status, tags, skip = 0, take = 20 } = options;
    
    const queryBuilder = this.customerRepository.createQueryBuilder('customer')
      .leftJoinAndSelect('customer.contacts', 'contacts')
      .where('customer.deletedAt IS NULL');

    // Search filter
    if (search) {
      queryBuilder.andWhere(
        '(customer.name ILIKE :search OR customer.city ILIKE :search OR customer.notes ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    // Status filter
    if (status) {
      queryBuilder.andWhere('customer.status = :status', { status });
    }

    // Tags filter
    if (tags && tags.length > 0) {
      tags.forEach((tag, index) => {
        queryBuilder.andWhere(`customer.tags ILIKE :tag${index}`, { [`tag${index}`]: `%${tag}%` });
      });
    }

    // Get total count for pagination
    const total = await queryBuilder.getCount();

    // Apply pagination
    queryBuilder
      .orderBy('customer.createdAt', 'DESC')
      .skip(skip)
      .take(take);

    const data = await queryBuilder.getMany();

    return {
      data,
      total,
      page: Math.floor(skip / take) + 1,
      limit: take,
      totalPages: Math.ceil(total / take),
    };
  }

  async findOne(id: string): Promise<Customer> {
    const customer = await this.customerRepository.findOne({
      where: { id, deletedAt: null },
      relations: ['contacts'],
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    return customer;
  }

  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    const customer = this.customerRepository.create(createCustomerDto);
    return this.customerRepository.save(customer);
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto): Promise<Customer> {
    const customer = await this.findOne(id);
    Object.assign(customer, updateCustomerDto);
    return this.customerRepository.save(customer);
  }

  async remove(id: string): Promise<{ message: string }> {
    const customer = await this.findOne(id);
    await this.customerRepository.softRemove(customer);
    return { message: 'Customer deleted successfully' };
  }

  async restore(id: string): Promise<Customer> {
    const customer = await this.customerRepository.findOne({
      where: { id },
      withDeleted: true,
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    customer.deletedAt = null;
    return this.customerRepository.save(customer);
  }

  async addContact(customerId: string, createContactDto: CreateContactDto): Promise<Contact> {
    const customer = await this.findOne(customerId);
    const contact = this.contactRepository.create({
      ...createContactDto,
      customerId,
    });
    return this.contactRepository.save(contact);
  }

  async removeContact(contactId: string): Promise<{ message: string }> {
    const contact = await this.contactRepository.findOne({
      where: { id: contactId },
    });

    if (!contact) {
      throw new NotFoundException('Contact not found');
    }

    await this.contactRepository.remove(contact);
    return { message: 'Contact deleted successfully' };
  }
}
