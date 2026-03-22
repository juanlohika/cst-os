import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiProperty } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { QueryTasksDto } from './dto/query-tasks.dto';
import { IsArray, IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

class ReorderDto {
  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  orderedIds: string[];
}

class LogTimeDto {
  @ApiProperty()
  @IsString()
  userId: string;

  @ApiProperty()
  @IsNumber()
  hours: number;

  @ApiProperty()
  @IsDateString()
  date: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description?: string;
}

@ApiTags('Tasks')
@ApiBearerAuth()
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a task' })
  create(@Body() dto: CreateTaskDto, @CurrentUser() user: any) {
    return this.tasksService.create(dto, user?.id);
  }

  @Get()
  @ApiOperation({ summary: 'List tasks (paginated, filterable)' })
  findAll(@Query() query: QueryTasksDto) {
    return this.tasksService.findAll(query);
  }

  @Get('my-tasks/:userId')
  @ApiOperation({ summary: 'Get My Tasks — Today | Week | Overdue | Inbox' })
  getMyTasks(
    @Param('userId') userId: string,
    @Query('view') view: 'today' | 'week' | 'overdue' | 'inbox' = 'inbox',
  ) {
    return this.tasksService.getMyTasks(userId, view);
  }

  @Get('export/:projectId')
  @ApiOperation({ summary: 'Export all tasks for a project (ERPNext-style)' })
  export(@Param('projectId') projectId: string) {
    return this.tasksService.exportByProject(projectId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get task detail' })
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a task' })
  update(@Param('id') id: string, @Body() dto: UpdateTaskDto, @CurrentUser() user: any) {
    return this.tasksService.update(id, dto, user?.id);
  }

  @Post(':id/log-time')
  @ApiOperation({ summary: 'Log time on a task' })
  logTime(@Param('id') taskId: string, @Body() dto: LogTimeDto) {
    return this.tasksService.logTime(
      taskId,
      dto.userId,
      dto.hours,
      new Date(dto.date),
      dto.description,
    );
  }

  @Post('reorder')
  @ApiOperation({ summary: 'Reorder tasks by sort order' })
  reorder(@Query('projectId') projectId: string, @Body() dto: ReorderDto) {
    return this.tasksService.reorder(projectId, dto.orderedIds);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Cancel a task (soft delete)' })
  remove(@Param('id') id: string) {
    return this.tasksService.remove(id);
  }
}
