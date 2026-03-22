import { Controller, Get, Post, Patch, Delete, Param, Body, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { LearningsService } from './learnings.service';
import { CreateLearningDto } from './dto/create-learning.dto';
import { UpdateLearningDto } from './dto/update-learning.dto';

@ApiTags('Learnings')
@ApiBearerAuth()
@Controller('learnings')
export class LearningsController {
  constructor(private readonly service: LearningsService) {}

  @Get()
  @ApiOperation({ summary: 'List project learnings' })
  findAll(
    @Query('projectId') projectId?: string,
    @Query('clientId') clientId?: string,
    @Query('category') category?: string,
    @Query('impactLevel') impactLevel?: string,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.service.findAll({
      projectId, clientId, category, impactLevel, search,
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get learning by ID' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create learning' })
  create(@Body() dto: CreateLearningDto, @CurrentUser() user: any) {
    return this.service.create(dto, user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update learning' })
  update(@Param('id') id: string, @Body() dto: UpdateLearningDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete learning' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
