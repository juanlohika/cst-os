import { Controller, Get, Post, Patch, Delete, Param, Body, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { MeetingsService } from './meetings.service';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { UpdateMeetingDto } from './dto/update-meeting.dto';
import { QueryMeetingsDto } from './dto/query-meetings.dto';

@ApiTags('Meetings')
@ApiBearerAuth()
@Controller('meetings')
export class MeetingsController {
  constructor(private readonly meetingsService: MeetingsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a meeting' })
  create(@Body() dto: CreateMeetingDto, @CurrentUser() user: any) {
    return this.meetingsService.create(dto, user?.id);
  }

  @Get()
  @ApiOperation({ summary: 'List meetings (paginated, filterable)' })
  findAll(@Query() query: QueryMeetingsDto) {
    return this.meetingsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get meeting detail' })
  findOne(@Param('id') id: string) {
    return this.meetingsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a meeting' })
  update(@Param('id') id: string, @Body() dto: UpdateMeetingDto) {
    return this.meetingsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Cancel a meeting (soft delete)' })
  remove(@Param('id') id: string) {
    return this.meetingsService.remove(id);
  }
}
