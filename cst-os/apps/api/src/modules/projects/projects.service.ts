import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { QueryProjectsDto } from './dto/query-projects.dto';
import { Prisma, ProjectPhase } from '@prisma/client';

@Injectable()
export class ProjectsService {
  constructor(
    private prisma: PrismaService,
    private notifications: NotificationsService,
  ) {}

  async create(dto: CreateProjectDto, createdById?: string) {
    const project = await this.prisma.project.create({
      data: { ...dto, createdById },
      include: {
        client: { select: { id: true, companyName: true } },
        pm: { select: { id: true, fullName: true } },
      },
    });

    if ((dto as any).status === 'active') {
      try {
        await this.notifications.createFeedEvent({
          eventType: 'project_created',
          entityType: 'project',
          entityId: project.id,
          actorId: createdById,
          content: `${project.projectName} is now active`,
          metadata: { projectName: project.projectName, clientName: (project.client as any)?.companyName },
        });
      } catch {
        // Feed event failure must never break project creation
      }
    }

    return project;
  }

  async findAll(query: QueryProjectsDto) {
    const {
      clientId,
      status,
      phase,
      projectType,
      priority,
      pmId,
      search,
      planningStatus,
      page = 1,
      limit = 25,
    } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.ProjectWhereInput = {
      // Default: only show official projects unless caller explicitly passes planningStatus
      planningStatus: planningStatus ?? 'official',
      ...(clientId && { clientId }),
      ...(status && { status }),
      ...(phase && { phase }),
      ...(projectType && { projectType }),
      ...(priority && { priority }),
      ...(pmId && { assignedPmId: pmId }),
      ...(search && {
        OR: [
          { projectName: { contains: search, mode: 'insensitive' } },
          { scopeDescription: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.project.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          client: { select: { id: true, companyName: true } },
          pm: { select: { id: true, fullName: true } },
          _count: { select: { tasks: true, milestones: true, rfas: true } },
        },
      }),
      this.prisma.project.count({ where }),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        client: { select: { id: true, companyName: true, status: true } },
        pm: { select: { id: true, fullName: true, email: true } },
        teamMembers: {
          include: {
            user: {
              select: { id: true, fullName: true, role: true, profilePhotoUrl: true, email: true },
            },
          },
          orderBy: { startDate: 'asc' },
        },
        externalContacts: {
          include: {
            contact: {
              select: { id: true, fullName: true, position: true, email: true, mobile: true, contactType: true },
            },
          },
        },
        milestones: { orderBy: { dueDate: 'asc' } },
        tasks: {
          where: { parentTaskId: null },
          orderBy: { sortOrder: 'asc' },
          include: { subtasks: true, assignedTo: { select: { id: true, fullName: true } } },
          take: 50,
        },
        riskItems: { where: { status: 'open' } },
        _count: {
          select: {
            tasks: true,
            milestones: true,
            rfas: true,
            brds: true,
            meetings: true,
          },
        },
      },
    });
    if (!project) throw new NotFoundException(`Project ${id} not found`);
    return project;
  }

  async update(id: string, dto: UpdateProjectDto) {
    await this.findOne(id);
    return this.prisma.project.update({
      where: { id },
      data: dto,
      include: {
        client: { select: { id: true, companyName: true } },
        pm: { select: { id: true, fullName: true } },
      },
    });
  }

  async advancePhase(id: string, actorId?: string) {
    const project = await this.findOne(id);
    const phases = Object.values(ProjectPhase);
    const currentIndex = phases.indexOf(project.phase);
    if (currentIndex === phases.length - 1) {
      throw new NotFoundException('Project is already in the final phase');
    }
    const nextPhase = phases[currentIndex + 1];
    const updated = await this.prisma.project.update({
      where: { id },
      data: { phase: nextPhase },
    });

    try {
      await this.notifications.createFeedEvent({
        eventType: 'project_phase_advanced',
        entityType: 'project',
        entityId: project.id,
        actorId,
        content: `${project.projectName} advanced to ${nextPhase} phase`,
        metadata: { projectName: project.projectName, newPhase: nextPhase },
      });
    } catch {
      // Feed event failure must never break phase advancement
    }

    return updated;
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.project.update({
      where: { id },
      data: { status: 'cancelled' },
    });
  }

  async addTeamMember(
    projectId: string,
    userId: string,
    projectRole?: string,
    raciRole?: string,
  ) {
    const role = (projectRole === 'project_manager' || projectRole === 'PM')
      ? 'project_manager' as const
      : (projectRole as any) ?? 'project_support' as const;
    // Normalize RACI: full word → initial, or keep as-is if already initials
    const normalizeRaci = (r?: string) => {
      if (!r) return 'R';
      return r.split(',').map(s => {
        const t = s.trim().toLowerCase();
        if (t === 'responsible') return 'R';
        if (t === 'accountable') return 'A';
        if (t === 'consulted') return 'C';
        if (t === 'informed') return 'I';
        return s.trim().toUpperCase().charAt(0);
      }).join(',');
    };
    const raciRoles = normalizeRaci(raciRole);

    const member = await this.prisma.projectTeamMember.upsert({
      where: { projectId_userId: { projectId, userId } },
      create: { projectId, userId, projectRole: role, raciRoles },
      update: { projectRole: role, raciRoles },
      include: {
        user: { select: { id: true, fullName: true, role: true, profilePhotoUrl: true } },
      },
    });

    // If PM role, also sync project.assignedPmId
    if (role === 'project_manager') {
      await this.prisma.project.update({
        where: { id: projectId },
        data: { assignedPmId: userId },
      });
    }
    return member;
  }

  async removeTeamMember(projectId: string, userId: string) {
    return this.prisma.projectTeamMember.delete({
      where: { projectId_userId: { projectId, userId } },
    });
  }

  async addExternalContact(projectId: string, contactId: string, raciRole?: string, notes?: string) {
    return this.prisma.projectExternalContact.upsert({
      where: { projectId_contactId: { projectId, contactId } },
      create: { projectId, contactId, raciRoles: raciRole ?? 'I', notes },
      update: { raciRoles: raciRole ?? 'I', notes },
      include: {
        contact: {
          select: { id: true, fullName: true, position: true, email: true, mobile: true, contactType: true },
        },
      },
    });
  }

  async removeExternalContact(projectId: string, contactId: string) {
    return this.prisma.projectExternalContact.delete({
      where: { projectId_contactId: { projectId, contactId } },
    });
  }

  async getClientContacts(projectId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      select: { clientId: true },
    });
    if (!project) throw new NotFoundException(`Project ${projectId} not found`);
    return this.prisma.clientContact.findMany({
      where: { clientId: project.clientId, isActive: true },
      orderBy: { isPrimary: 'desc' },
    });
  }

  async exportAll() {
    return this.prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        projectName: true,
        projectType: true,
        status: true,
        phase: true,
        priority: true,
        riskLevel: true,
        startDate: true,
        targetGoLiveDate: true,
        actualGoLiveDate: true,
        estimatedManhours: true,
        actualManhours: true,
        client: { select: { companyName: true } },
        pm: { select: { fullName: true } },
      },
    });
  }

  // ── Apply Template to Project ──────────────────────────────────────────────

  async applyTemplate(
    projectId: string,
    templateId: string,
    roleAssignments: {
      project_manager?: string;   // userId
      project_support?: string[]; // userIds (round-robin if multiple)
    } = {},
  ) {
    const project = await this.findOne(projectId);
    const template = await this.prisma.projectTemplate.findUnique({
      where: { id: templateId },
      include: {
        phases: {
          orderBy: { sortOrder: 'asc' },
          include: {
            milestones: {
              orderBy: { sortOrder: 'asc' },
              include: { defaultTasks: { orderBy: { sortOrder: 'asc' } } },
            },
          },
        },
      },
    });
    if (!template) throw new NotFoundException(`Template ${templateId} not found`);

    const pmId = roleAssignments.project_manager ?? project.assignedPmId ?? undefined;
    const supportIds = roleAssignments.project_support ?? [];

    let supportIndex = 0;
    function resolveAssignee(projectRole?: string | null): string | undefined {
      if (!projectRole || projectRole === 'unassigned') return undefined;
      if (projectRole === 'project_manager') return pmId;
      if (projectRole === 'project_support' && supportIds.length > 0) {
        const id = supportIds[supportIndex % supportIds.length];
        supportIndex++;
        return id;
      }
      return undefined;
    }

    let milestonesCreated = 0;
    let tasksCreated = 0;

    for (const phase of template.phases) {
      for (const milestone of phase.milestones) {
        const created = await this.prisma.milestone.create({
          data: {
            projectId,
            title: milestone.title,
            phase: (phase.phase as any) ?? null,
          },
        });
        milestonesCreated++;

        for (const dt of milestone.defaultTasks) {
          const assignedToId = resolveAssignee(dt.assignedToProjectRole);
          await this.prisma.task.create({
            data: {
              projectId,
              milestoneId: created.id,
              title: dt.title,
              type: dt.taskType as any,
              isMilestone: dt.isMilestone,
              isExternal: dt.isExternal,
              estimatedHours: dt.estimatedHours,
              sortOrder: dt.sortOrder,
              status: 'todo',
              ...(assignedToId && { assignedToId }),
            },
          });
          tasksCreated++;
        }
      }
    }

    // Record which template version was applied
    await this.prisma.project.update({
      where: { id: projectId },
      data: { templateVersionId: templateId },
    });

    return { milestonesCreated, tasksCreated, templateName: template.name };
  }

  // ── Project Templates ──────────────────────────────────────────────────────

  async findAllTemplates(statusFilter?: string) {
    return this.prisma.projectTemplate.findMany({
      where: statusFilter ? { status: statusFilter as any } : { status: { in: ['draft', 'published'] } },
      orderBy: [{ code: 'asc' }, { version: 'desc' }],
      include: {
        phases: {
          orderBy: { sortOrder: 'asc' },
          include: { milestones: { orderBy: { sortOrder: 'asc' } } },
        },
        _count: { select: { childVersions: true } },
      },
    });
  }

  async findOneTemplate(id: string) {
    const t = await this.prisma.projectTemplate.findUnique({
      where: { id },
      include: {
        phases: {
          orderBy: { sortOrder: 'asc' },
          include: { milestones: { orderBy: { sortOrder: 'asc' } } },
        },
        parentTemplate: { select: { id: true, name: true, version: true } },
        childVersions: { select: { id: true, version: true, status: true, publishedAt: true } },
      },
    });
    if (!t) throw new NotFoundException(`Template ${id} not found`);
    return t;
  }

  async createTemplate(dto: {
    code: string;
    name: string;
    description?: string;
    projectType: string;
    totalHours?: number;
    parentTemplateId?: string;
  }) {
    // Auto-increment version if same code exists
    const existing = await this.prisma.projectTemplate.findMany({ where: { code: dto.code } });
    const version = existing.length > 0 ? Math.max(...existing.map(t => t.version)) + 1 : 1;
    return this.prisma.projectTemplate.create({
      data: { ...(dto as any), version, status: 'draft' },
    });
  }

  async updateTemplate(id: string, dto: Partial<{
    name: string;
    description: string;
    isActive: boolean;
    totalHours: number;
    notes: string;
  }>) {
    await this.findOneTemplate(id);
    return this.prisma.projectTemplate.update({ where: { id }, data: dto as any });
  }

  async publishTemplate(id: string, publishedById?: string) {
    const template = await this.findOneTemplate(id);
    // Archive previously published versions of the same code
    await this.prisma.projectTemplate.updateMany({
      where: { code: template.code, status: 'published', id: { not: id } },
      data: { status: 'archived' },
    });
    return this.prisma.projectTemplate.update({
      where: { id },
      data: { status: 'published', publishedAt: new Date(), publishedById: publishedById ?? null },
    });
  }

  async archiveTemplate(id: string) {
    return this.prisma.projectTemplate.update({
      where: { id },
      data: { status: 'archived' },
    });
  }

  async updatePhaseNorms(phaseId: string, dto: { normDays?: number; minDays?: number; maxDays?: number }) {
    return this.prisma.projectTemplatePhase.update({ where: { id: phaseId }, data: dto });
  }

  // ── Template Tasks ─────────────────────────────────────────────────────────

  async findTemplateTasks(templateId: string) {
    return this.prisma.projectTemplate.findUnique({
      where: { id: templateId },
      include: {
        phases: {
          orderBy: { sortOrder: 'asc' },
          include: {
            milestones: {
              orderBy: { sortOrder: 'asc' },
              include: { defaultTasks: { orderBy: { sortOrder: 'asc' } } },
            },
          },
        },
      },
    });
  }

  async createDefaultTask(dto: {
    milestoneId: string;
    code: string;
    title: string;
    taskType: string;
    estimatedHours?: number;
    assignedToProjectRole?: string;
    description?: string;
    isMilestone?: boolean;
    isExternal?: boolean;
    sortOrder?: number;
  }) {
    return this.prisma.defaultTask.create({ data: dto as any });
  }

  async updateDefaultTask(taskId: string, dto: Partial<{
    title: string;
    taskType: string;
    estimatedHours: number;
    assignedToProjectRole: string;
    description: string;
    isMilestone: boolean;
    isExternal: boolean;
    sortOrder: number;
  }>) {
    return this.prisma.defaultTask.update({ where: { id: taskId }, data: dto as any });
  }

  async deleteDefaultTask(taskId: string) {
    return this.prisma.defaultTask.delete({ where: { id: taskId } });
  }
}
