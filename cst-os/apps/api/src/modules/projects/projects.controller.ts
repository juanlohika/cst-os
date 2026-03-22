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
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { QueryProjectsDto } from './dto/query-projects.dto';
import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

class AddTeamMemberDto {
  @ApiPropertyOptional()
  @IsString()
  userId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  projectRole?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  raciRole?: string;
}

@ApiTags('Projects')
@ApiBearerAuth()
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a project' })
  create(@Body() dto: CreateProjectDto, @CurrentUser() user: any) {
    return this.projectsService.create(dto, user?.id);
  }

  @Get()
  @ApiOperation({ summary: 'List all projects (paginated, filterable)' })
  findAll(@Query() query: QueryProjectsDto) {
    return this.projectsService.findAll(query);
  }

  @Get('export')
  @ApiOperation({ summary: 'Export all projects (ERPNext-style)' })
  export() {
    return this.projectsService.exportAll();
  }

  // ── Project Templates (must be before :id routes) ─────────────────────────

  @Get('templates')
  @ApiOperation({ summary: 'List project templates' })
  findAllTemplates(@Query('status') status?: string) {
    return this.projectsService.findAllTemplates(status);
  }

  @Post('templates')
  @ApiOperation({ summary: 'Create project template' })
  createTemplate(@Body() body: any) {
    return this.projectsService.createTemplate(body);
  }

  @Get('templates/:id')
  @ApiOperation({ summary: 'Get project template' })
  findOneTemplate(@Param('id') id: string) {
    return this.projectsService.findOneTemplate(id);
  }

  @Patch('templates/:id')
  @ApiOperation({ summary: 'Update project template' })
  updateTemplate(@Param('id') id: string, @Body() body: any) {
    return this.projectsService.updateTemplate(id, body);
  }

  @Post('templates/:id/publish')
  @ApiOperation({ summary: 'Publish a template version (archives other published versions)' })
  publishTemplate(@Param('id') id: string, @CurrentUser() user: any) {
    return this.projectsService.publishTemplate(id, user?.id);
  }

  @Post('templates/:id/archive')
  @ApiOperation({ summary: 'Archive a template version' })
  archiveTemplate(@Param('id') id: string) {
    return this.projectsService.archiveTemplate(id);
  }

  @Patch('template-phases/:id/norms')
  @ApiOperation({ summary: 'Update phase norm days' })
  updatePhaseNorms(@Param('id') id: string, @Body() body: any) {
    return this.projectsService.updatePhaseNorms(id, body);
  }

  @Get('templates/:id/tasks')
  @ApiOperation({ summary: 'Get template with all tasks' })
  findTemplateTasks(@Param('id') id: string) {
    return this.projectsService.findTemplateTasks(id);
  }

  @Post('template-tasks')
  @ApiOperation({ summary: 'Create default task in template milestone' })
  createDefaultTask(@Body() body: any) {
    return this.projectsService.createDefaultTask(body);
  }

  @Patch('template-tasks/:id')
  @ApiOperation({ summary: 'Update default task' })
  updateDefaultTask(@Param('id') id: string, @Body() body: any) {
    return this.projectsService.updateDefaultTask(id, body);
  }

  @Delete('template-tasks/:id')
  @ApiOperation({ summary: 'Delete default task' })
  deleteDefaultTask(@Param('id') id: string) {
    return this.projectsService.deleteDefaultTask(id);
  }

  // ── Project CRUD ──────────────────────────────────────────────────────────

  @Get(':id')
  @ApiOperation({ summary: 'Get full project detail' })
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update project' })
  update(@Param('id') id: string, @Body() dto: UpdateProjectDto) {
    return this.projectsService.update(id, dto);
  }

  @Post(':id/advance-phase')
  @ApiOperation({ summary: 'Advance project to next phase' })
  advancePhase(@Param('id') id: string, @CurrentUser() user: any) {
    return this.projectsService.advancePhase(id, user?.id);
  }

  @Post(':id/apply-template')
  @ApiOperation({ summary: 'Apply a published template to a project (creates milestones + tasks)' })
  applyTemplate(
    @Param('id') id: string,
    @Body() body: { templateId: string; roleAssignments?: { project_manager?: string; project_support?: string[] } },
  ) {
    return this.projectsService.applyTemplate(id, body.templateId, body.roleAssignments);
  }

  @Post(':id/team')
  @ApiOperation({ summary: 'Add team member to project with RACI role' })
  addTeamMember(@Param('id') id: string, @Body() dto: AddTeamMemberDto) {
    return this.projectsService.addTeamMember(id, dto.userId, dto.projectRole, dto.raciRole);
  }

  @Delete(':id/team/:userId')
  @ApiOperation({ summary: 'Remove team member from project' })
  removeTeamMember(@Param('id') id: string, @Param('userId') userId: string) {
    return this.projectsService.removeTeamMember(id, userId);
  }

  @Get(':id/client-contacts')
  @ApiOperation({ summary: 'Get client contacts available to add to project' })
  getClientContacts(@Param('id') id: string) {
    return this.projectsService.getClientContacts(id);
  }

  @Post(':id/external-contacts')
  @ApiOperation({ summary: 'Add external contact to project with RACI role' })
  addExternalContact(@Param('id') id: string, @Body() body: any) {
    return this.projectsService.addExternalContact(id, body.contactId, body.raciRole, body.notes);
  }

  @Delete(':id/external-contacts/:contactId')
  @ApiOperation({ summary: 'Remove external contact from project' })
  removeExternalContact(@Param('id') id: string, @Param('contactId') contactId: string) {
    return this.projectsService.removeExternalContact(id, contactId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Cancel project (soft delete)' })
  remove(@Param('id') id: string) {
    return this.projectsService.remove(id);
  }
}
