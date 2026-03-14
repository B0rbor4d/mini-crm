import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CreateContactDto } from './dto/create-contact.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('customers')
@Controller('customers')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all customers with pagination' })
  @ApiResponse({ status: 200, description: 'List of customers' })
  @ApiQuery({ name: 'search', required: false, description: 'Search by name, city, or notes' })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by status (active, inactive, prospect)' })
  @ApiQuery({ name: 'tags', required: false, isArray: true, description: 'Filter by tags' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page (default: 20, max: 100)' })
  findAll(
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('tags') tags?: string | string[],
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit?: number,
  ) {
    // Normalize tags to array
    const tagsArray = tags ? (Array.isArray(tags) ? tags : [tags]) : undefined;
    
    // Validate and cap limit
    const validatedLimit = Math.min(Math.max(limit || 20, 1), 100);
    const skip = ((page || 1) - 1) * validatedLimit;

    return this.customersService.findAll({
      search,
      status,
      tags: tagsArray,
      skip,
      take: validatedLimit,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get customer by ID' })
  @ApiResponse({ status: 200, description: 'Customer found' })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  findOne(@Param('id') id: string) {
    return this.customersService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new customer' })
  @ApiResponse({ status: 201, description: 'Customer created' })
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customersService.create(createCustomerDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update customer' })
  @ApiResponse({ status: 200, description: 'Customer updated' })
  update(@Param('id') id: string, @Body() updateCustomerDto: UpdateCustomerDto) {
    return this.customersService.update(id, updateCustomerDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete customer (soft delete)' })
  @ApiResponse({ status: 200, description: 'Customer deleted' })
  remove(@Param('id') id: string) {
    return this.customersService.remove(id);
  }

  @Post(':id/restore')
  @ApiOperation({ summary: 'Restore soft-deleted customer' })
  @ApiResponse({ status: 200, description: 'Customer restored' })
  restore(@Param('id') id: string) {
    return this.customersService.restore(id);
  }

  @Post(':id/contacts')
  @ApiOperation({ summary: 'Add contact to customer' })
  @ApiResponse({ status: 201, description: 'Contact added' })
  addContact(@Param('id') id: string, @Body() createContactDto: CreateContactDto) {
    return this.customersService.addContact(id, createContactDto);
  }

  @Delete('contacts/:contactId')
  @ApiOperation({ summary: 'Delete contact' })
  @ApiResponse({ status: 200, description: 'Contact deleted' })
  removeContact(@Param('contactId') contactId: string) {
    return this.customersService.removeContact(contactId);
  }
}
