import { Controller, Get, Post, Patch, Delete, Param, Body, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { TimelineBaselinesService } from './timeline-baselines.service';

@ApiTags('Timeline Baselines')
@ApiBearerAuth()
@Controller('timeline-baselines')
export class TimelineBaselinesController {
  constructor(private readonly service: TimelineBaselinesService) {}

  @Get()
  @ApiOperation({ summary: 'List all baseline versions' })
  findAll(@Query('projectType') projectType?: string) {
    return this.service.findAll(projectType);
  }

  @Post()
  @ApiOperation({ summary: 'Create new baseline version' })
  create(@Body() body: any, @CurrentUser() user: any) {
    return this.service.create({ ...body, createdById: user?.id });
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update baseline version' })
  update(@Param('id') id: string, @Body() body: any) {
    return this.service.update(id, body);
  }

  @Post(':id/activate')
  @ApiOperation({ summary: 'Activate this version (archives others of same type)' })
  activate(@Param('id') id: string) {
    return this.service.activate(id);
  }

  @Post(':id/archive')
  @ApiOperation({ summary: 'Archive this version' })
  archive(@Param('id') id: string) {
    return this.service.archive(id);
  }
}
