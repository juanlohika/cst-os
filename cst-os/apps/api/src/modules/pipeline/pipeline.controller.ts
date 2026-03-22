import { Controller, Get, Post, Patch, Param, Body, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { PipelineService } from './pipeline.service';
import { DealStage } from '@prisma/client';

@ApiTags('Pipeline')
@ApiBearerAuth()
@Controller('pipeline')
export class PipelineController {
  constructor(private readonly service: PipelineService) {}

  @Get()
  @ApiOperation({ summary: 'List pipeline deals' })
  findAll(
    @Query('stage') stage?: DealStage,
    @Query('search') search?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return this.service.findAll({
      stage,
      search,
      limit: limit ? parseInt(limit, 10) : 50,
      offset: offset ? parseInt(offset, 10) : 0,
    });
  }

  @Get('stats')
  @ApiOperation({ summary: 'Deal count by stage' })
  stageStats() {
    return this.service.stageStats();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a pipeline deal' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a pipeline deal' })
  create(@Body() body: any, @CurrentUser() user: any) {
    return this.service.create(body, user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a pipeline deal' })
  update(@Param('id') id: string, @Body() body: any) {
    return this.service.update(id, body);
  }
}
