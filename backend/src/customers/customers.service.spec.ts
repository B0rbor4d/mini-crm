import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomersService, FindAllOptions, PaginatedCustomers } from './customers.service';
import { Customer } from './entities/customer.entity';
import { Contact } from './entities/contact.entity';
import { NotFoundException } from '@nestjs/common';

const mockCustomer: Customer = {
  id: '1',
  name: 'Test Customer',
  industry: 'Technology',
  website: 'https://test.com',
  address: '123 Test St',
  city: 'Stuttgart',
  postalCode: '70173',
  country: 'Germany',
  notes: 'Test notes',
  status: 'active',
  tags: ['vip', 'enterprise'],
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
  contacts: [],
};

const mockContact: Contact = {
  id: '1',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  phone: '+1234567890',
  position: 'Manager',
  isPrimary: true,
  customerId: '1',
  customer: mockCustomer,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockCustomerRepository = () => ({
  createQueryBuilder: jest.fn(() => ({
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getCount: jest.fn().mockResolvedValue(1),
    getMany: jest.fn().mockResolvedValue([mockCustomer]),
  })),
  findOne: jest.fn(),
  create: jest.fn().mockReturnValue(mockCustomer),
  save: jest.fn().mockResolvedValue(mockCustomer),
  softRemove: jest.fn().mockResolvedValue(undefined),
  find: jest.fn().mockResolvedValue([mockCustomer]),
});

const mockContactRepository = () => ({
  create: jest.fn().mockReturnValue(mockContact),
  save: jest.fn().mockResolvedValue(mockContact),
  findOne: jest.fn(),
  remove: jest.fn().mockResolvedValue(undefined),
});

describe('CustomersService', () => {
  let service: CustomersService;
  let customerRepository: jest.Mocked<Repository<Customer>>;
  let contactRepository: jest.Mocked<Repository<Contact>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomersService,
        { provide: getRepositoryToken(Customer), useFactory: mockCustomerRepository },
        { provide: getRepositoryToken(Contact), useFactory: mockContactRepository },
      ],
    }).compile();

    service = module.get<CustomersService>(CustomersService);
    customerRepository = module.get(getRepositoryToken(Customer));
    contactRepository = module.get(getRepositoryToken(Contact));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated customers', async () => {
      const result = await service.findAll();

      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('total');
      expect(result).toHaveProperty('page');
      expect(result).toHaveProperty('limit');
      expect(result).toHaveProperty('totalPages');
      expect(result.data).toEqual([mockCustomer]);
    });

    it('should apply search filter', async () => {
      const options: FindAllOptions = { search: 'Test' };
      await service.findAll(options);

      const queryBuilder = customerRepository.createQueryBuilder();
      expect(queryBuilder.andWhere).toHaveBeenCalledWith(
        '(customer.name ILIKE :search OR customer.city ILIKE :search OR customer.notes ILIKE :search)',
        { search: '%Test%' }
      );
    });

    it('should apply status filter', async () => {
      const options: FindAllOptions = { status: 'active' };
      await service.findAll(options);

      const queryBuilder = customerRepository.createQueryBuilder();
      expect(queryBuilder.andWhere).toHaveBeenCalledWith('customer.status = :status', { status: 'active' });
    });

    it('should apply tags filter', async () => {
      const options: FindAllOptions = { tags: ['vip'] };
      await service.findAll(options);

      const queryBuilder = customerRepository.createQueryBuilder();
      expect(queryBuilder.andWhere).toHaveBeenCalled();
    });

    it('should apply pagination', async () => {
      const options: FindAllOptions = { skip: 20, take: 10 };
      await service.findAll(options);

      const queryBuilder = customerRepository.createQueryBuilder();
      expect(queryBuilder.skip).toHaveBeenCalledWith(20);
      expect(queryBuilder.take).toHaveBeenCalledWith(10);
    });
  });

  describe('findOne', () => {
    it('should return a customer by id', async () => {
      customerRepository.findOne.mockResolvedValue(mockCustomer);
      
      const result = await service.findOne('1');
      
      expect(result).toEqual(mockCustomer);
      expect(customerRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1', deletedAt: null },
        relations: ['contacts'],
      });
    });

    it('should throw NotFoundException if customer not found', async () => {
      customerRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a new customer', async () => {
      const createDto = {
        name: 'New Customer',
        industry: 'Technology',
        status: 'active',
        tags: ['new'],
      };

      const result = await service.create(createDto);

      expect(customerRepository.create).toHaveBeenCalledWith(createDto);
      expect(customerRepository.save).toHaveBeenCalled();
      expect(result).toEqual(mockCustomer);
    });
  });

  describe('update', () => {
    it('should update a customer', async () => {
      customerRepository.findOne.mockResolvedValue(mockCustomer);
      const updateDto = { name: 'Updated Name' };

      const result = await service.update('1', updateDto);

      expect(customerRepository.save).toHaveBeenCalled();
      expect(result.name).toBe('Updated Name');
    });

    it('should throw NotFoundException if customer not found', async () => {
      customerRepository.findOne.mockResolvedValue(null);

      await expect(service.update('999', { name: 'Test' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should soft delete a customer', async () => {
      customerRepository.findOne.mockResolvedValue(mockCustomer);

      const result = await service.remove('1');

      expect(customerRepository.softRemove).toHaveBeenCalledWith(mockCustomer);
      expect(result).toEqual({ message: 'Customer deleted successfully' });
    });

    it('should throw NotFoundException if customer not found', async () => {
      customerRepository.findOne.mockResolvedValue(null);

      await expect(service.remove('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('restore', () => {
    it('should restore a soft-deleted customer', async () => {
      const deletedCustomer = { ...mockCustomer, deletedAt: new Date() };
      customerRepository.findOne.mockResolvedValue(deletedCustomer);

      const result = await service.restore('1');

      expect(result.deletedAt).toBeNull();
      expect(customerRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException if customer not found', async () => {
      customerRepository.findOne.mockResolvedValue(null);

      await expect(service.restore('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('addContact', () => {
    it('should add a contact to a customer', async () => {
      customerRepository.findOne.mockResolvedValue(mockCustomer);
      const contactDto = {
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane@example.com',
      };

      const result = await service.addContact('1', contactDto);

      expect(contactRepository.create).toHaveBeenCalledWith({
        ...contactDto,
        customerId: '1',
      });
      expect(contactRepository.save).toHaveBeenCalled();
      expect(result).toEqual(mockContact);
    });

    it('should throw NotFoundException if customer not found', async () => {
      customerRepository.findOne.mockResolvedValue(null);

      await expect(service.addContact('999', { firstName: 'Test', email: 'test@test.com' }))
        .rejects.toThrow(NotFoundException);
    });
  });

  describe('removeContact', () => {
    it('should remove a contact', async () => {
      contactRepository.findOne.mockResolvedValue(mockContact);

      const result = await service.removeContact('1');

      expect(contactRepository.remove).toHaveBeenCalledWith(mockContact);
      expect(result).toEqual({ message: 'Contact deleted successfully' });
    });

    it('should throw NotFoundException if contact not found', async () => {
      contactRepository.findOne.mockResolvedValue(null);

      await expect(service.removeContact('999')).rejects.toThrow(NotFoundException);
    });
  });
});
