import { Test, TestingModule } from '@nestjs/testing';
import { CustomersService } from './customers.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Customer } from '../entities/customer.entity';
import { Contact } from '../entities/contact.entity';
import { NotFoundException } from '@nestjs/common';

const mockCustomerRepository = {
  create: jest.fn(),
  save: jest.fn(),
  findAndCount: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

const mockContactRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
};

describe('CustomersService', () => {
  let service: CustomersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomersService,
        {
          provide: getRepositoryToken(Customer),
          useValue: mockCustomerRepository,
        },
        {
          provide: getRepositoryToken(Contact),
          useValue: mockContactRepository,
        },
      ],
    }).compile();

    service = module.get<CustomersService>(CustomersService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a customer', async () => {
      const dto = { companyName: 'Test GmbH', email: 'test@test.com' };
      const userId = 'user-1';
      const customer = { id: '1', ...dto, createdById: userId };

      mockCustomerRepository.create.mockReturnValue(customer);
      mockCustomerRepository.save.mockResolvedValue(customer);

      const result = await service.create(dto as any, userId);

      expect(result).toEqual(customer);
      expect(mockCustomerRepository.create).toHaveBeenCalledWith({
        ...dto,
        createdById: userId,
      });
    });
  });

  describe('findAll', () => {
    it('should return paginated customers', async () => {
      const customers = [
        { id: '1', companyName: 'Test GmbH' },
        { id: '2', companyName: 'Beispiel AG' },
      ];

      mockCustomerRepository.findAndCount.mockResolvedValue([customers, 2]);

      const result = await service.findAll({ page: 1, limit: 10 });

      expect(result.data).toEqual(customers);
      expect(result.total).toBe(2);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
    });

    it('should search customers', async () => {
      mockCustomerRepository.findAndCount.mockResolvedValue([[], 0]);

      await service.findAll({ search: 'Test' });

      expect(mockCustomerRepository.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            companyName: expect.any(Object),
          }),
        }),
      );
    });
  });

  describe('findOne', () => {
    it('should return a customer by id', async () => {
      const customer = { id: '1', companyName: 'Test GmbH' };
      mockCustomerRepository.findOne.mockResolvedValue(customer);

      const result = await service.findOne('1');

      expect(result).toEqual(customer);
    });

    it('should throw NotFoundException if customer not found', async () => {
      mockCustomerRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a customer', async () => {
      const customer = { id: '1', companyName: 'Old Name' };
      const updateDto = { companyName: 'New Name' };

      mockCustomerRepository.findOne.mockResolvedValue(customer);
      mockCustomerRepository.save.mockResolvedValue({ ...customer, ...updateDto });

      const result = await service.update('1', updateDto as any);

      expect(result.companyName).toBe('New Name');
    });
  });

  describe('remove', () => {
    it('should soft delete a customer', async () => {
      const customer = { id: '1', companyName: 'Test GmbH', deletedAt: null };
      mockCustomerRepository.findOne.mockResolvedValue(customer);
      mockCustomerRepository.save.mockImplementation((c) => Promise.resolve(c));

      await service.remove('1');

      expect(customer.deletedAt).toBeInstanceOf(Date);
    });
  });
});
