import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { Contact } from './entities/contact.entity';
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

  async findAll(search?: string) {
    const where = search
      ? [
          { name: Like(`%${search}%`) },
          { city: Like(`%${search}%`) },
        ]
      : {};

    return this.customerRepository.find({
      where,
      relations: ['contacts'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    const customer = await this.customerRepository.findOne({
      where: { id },
      relations: ['contacts'],
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    return customer;
  }

  async create(createCustomerDto: CreateCustomerDto) {
    const customer = this.customerRepository.create(createCustomerDto);
    return this.customerRepository.save(customer);
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto) {
    const customer = await this.findOne(id);
    Object.assign(customer, updateCustomerDto);
    return this.customerRepository.save(customer);
  }

  async remove(id: string) {
    const customer = await this.findOne(id);
    await this.customerRepository.remove(customer);
    return { message: 'Customer deleted successfully' };
  }

  async addContact(customerId: string, createContactDto: CreateContactDto) {
    const customer = await this.findOne(customerId);
    const contact = this.contactRepository.create({
      ...createContactDto,
      customerId,
    });
    return this.contactRepository.save(contact);
  }
}
