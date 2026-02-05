import { Controller, Get, Post, Put, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { EmailsService } from './emails.service';
import { AssignEmailDto, EmailFilterDto } from './dto/email.dto';

@ApiTags('emails')
@Controller('emails')
export class EmailsController {
  constructor(private readonly emailsService: EmailsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all emails' })
  findAll(@Query() filters: EmailFilterDto) {
    return this.emailsService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get email by ID' })
  findOne(@Param('id') id: string) {
    return this.emailsService.findOne(id);
  }

  @Post(':id/assign')
  @ApiOperation({ summary: 'Assign email to project' })
  assignToProject(@Param('id') id: string, @Body() assignDto: AssignEmailDto) {
    return this.emailsService.assignToProject(id, assignDto.projectId);
  }

  @Put(':id/read')
  @ApiOperation({ summary: 'Mark email as read' })
  markAsRead(@Param('id') id: string) {
    return this.emailsService.markAsRead(id);
  }
}
