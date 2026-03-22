import { Controller, Get, Post, Patch, Delete, Param, Body, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { KnowledgeBaseService } from './knowledge-base.service';

@ApiTags('Knowledge Base')
@ApiBearerAuth()
@Controller('knowledge-base')
export class KnowledgeBaseController {
  constructor(private readonly service: KnowledgeBaseService) {}

  @Get()
  @ApiOperation({ summary: 'List knowledge base articles' })
  findAll(
    @Query('category') category?: string,
    @Query('status') status?: string,
    @Query('search') search?: string,
    @Query('limit') limit?: string,
  ) {
    return this.service.findAll({ category, status, search, limit: limit ? parseInt(limit, 10) : 50 });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get article by ID' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create KB article' })
  create(
    @Body() body: { title: string; category: string; content?: string; tags?: string[]; productArea?: string },
    @CurrentUser() user: any,
  ) {
    return this.service.create({ ...body, ownerId: user.id });
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update KB article' })
  update(@Param('id') id: string, @Body() body: any) {
    return this.service.update(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete KB article' })
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
