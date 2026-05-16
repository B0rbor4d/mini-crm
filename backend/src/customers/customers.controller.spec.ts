import { Test, TestingModule } from '@nestjs/testing';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

const mockCustomersService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  createContact: jest.fn(),
  findContacts: jest.fn(),
};

describe('CustomersController', () => {
  let controller: CustomersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomersController],
      providers: [
        {
          provide: CustomersService,
          useValue: mockCustomersService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<CustomersController>(CustomersController);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a customer', async () => {
      const dto = { companyName: 'Test GmbH' };
      const req = { user: { sub: 'user-1' } };
      const customer = { id: '1', ...dto };

      mockCustomersService.create.mockResolvedValue(customer);

      const result = await controller.create(dto as any, req as any);

      expect(result).toEqual(customer);
      expect(mockCustomersService.create).toHaveBeenCalledWith(dto, 'user-1');
    });
  });

  describe('findAll', () => {
    it('should return all customers', async () => {
      const customers = {
        data: [{ id: '1', companyName: 'Test GmbH' }],
        total: 1,
        page: 1,
        limit: 10,
      };

      mockCustomersService.findAll.mockResolvedValue(customers);

      const result = await controller.findAll();

      expect(result).toEqual(customers);
    });
  });

  describe('findOne', () => {
    it('should return a customer', async () => {
      const customer = { id: '1', companyName: 'Test GmbH' };
      mockCustomersService.findOne.mockResolvedValue(customer);

      const result = await controller.findOne('1');

      expect(result).toEqual(customer);
    });
  });

  describe('update', () => {
    it('should update a customer', async () => {
      const dto = { companyName: 'New Name' };
      const customer = { id: '1', ...dto };

      mockCustomersService.update.mockResolvedValue(customer);

      const result = await controller.update('1', dto as any);

      expect(result).toEqual(customer);
    });
  });

  describe('remove', () => {
    it('should delete a customer', async () => {
      mockCustomersService.remove.mockResolvedValue(undefined);

      await controller.remove('1');

      expect(mockCustomersService.remove).toHaveBeenCalledWith('1');
    });
  });
});
