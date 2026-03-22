import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

// ── Context shapes ───────────────────────────────────────────────────────────
export interface ClientContext {
  id: string; name: string; tier: string; lifecycleStage: string;
  healthScore: number; assignedAccountManager: { id: string; name: string } | null;
  activeProjects: { id: string; name: string; phase: string }[];
}
export interface ProjectContext {
  id: string; name: string; phase: string; status: string;
  client: { id: string; name: string };
  projectManager: { id: string; name: string } | null;
  teamMembers: { id: string; name: string; role: string }[];
  milestones: { id: string; name: string; dueDate: string | null; status: string }[];
  rfas: { id: string; rfaNumber: string; status: string }[];
  startDate: string | null; endDate: string | null;
}
export interface TaskContext {
  id: string; title: string; status: string; priority: string;
  assignee: { id: string; name: string } | null;
  project: { id: string; name: string } | null;
  dueDate: string | null; estimatedHours: number | null;
}
export interface MeetingContext {
  id: string; title: string; meetingType: string; scheduledAt: string;
  attendees: any;
  transcript: string | null; aiSummary: string | null; actionItems: string | null;
}
export interface TeamMemberContext {
  id: string; name: string; email: string; role: string; department: string;
  activeProjects: { id: string; name: string }[];
  hoursLoggedThisWeek: number;
}

export interface ClientFilters { tier?: string; lifecycleStage?: string; assignedAmId?: string; }
export interface ProjectFilters { status?: string; phase?: string; clientId?: string; assignedPmId?: string; }
export interface TaskFilters { status?: string; priority?: string; assigneeId?: string; projectId?: string; }

export interface ClientSummary { id: string; name: string; tier: string; lifecycleStage: string; healthScore: number; }
export interface ProjectSummary { id: string; name: string; phase: string; status: string; clientName: string; }
export interface TaskSummary { id: string; title: string; status: string; priority: string; dueDate: string | null; }
export interface MasterDataGroupContext { code: string; name: string; values: { code: string; label: string; color: string; metadata: unknown }[]; }
export interface AiAppContext { id: string; name: string; contextType?: string; claudeMd: string; maxTokens: number; steps: unknown; }

export interface CreateTimelogDto { taskId: string; userId: string; hours: number; description?: string; isBillable?: boolean; loggedAt?: Date; }
export interface CreateTaskDto { title: string; projectId?: string; assigneeId?: string; priority?: string; dueDate?: Date; estimatedHours?: number; }

@Injectable()
export class AgentDataService {
  constructor(private readonly prisma: PrismaService) {}

  async getClient(id: string): Promise<ClientContext> {
    const c = await this.prisma.client.findUnique({
      where: { id },
      select: {
        id: true, companyName: true, tier: true, lifecycleStage: true,
        clientHealthScore: true,
        accountMgr: { select: { id: true, fullName: true } },
        projects: { where: { status: { not: 'completed' } }, select: { id: true, projectName: true, phase: true } },
      },
    });
    if (!c) throw new NotFoundException(`Client ${id} not found`);
    return {
      id: c.id, name: c.companyName, tier: c.tier ?? '', lifecycleStage: c.lifecycleStage ?? '',
      healthScore: c.clientHealthScore ?? 0,
      assignedAccountManager: c.accountMgr ? { id: c.accountMgr.id, name: c.accountMgr.fullName } : null,
      activeProjects: c.projects.map(p => ({ id: p.id, name: p.projectName, phase: p.phase ?? '' })),
    };
  }

  async getProject(id: string): Promise<ProjectContext> {
    const p = await this.prisma.project.findUnique({
      where: { id },
      select: {
        id: true, projectName: true, phase: true, status: true, startDate: true, targetGoLiveDate: true,
        client: { select: { id: true, companyName: true } },
        pm: { select: { id: true, fullName: true } },
        teamMembers: { select: { user: { select: { id: true, fullName: true } }, projectRole: true } },
        milestones: { select: { id: true, title: true, dueDate: true, status: true } },
        rfas: { select: { id: true, title: true, status: true } },
      },
    });
    if (!p) throw new NotFoundException(`Project ${id} not found`);
    return {
      id: p.id, name: p.projectName, phase: p.phase ?? '', status: p.status ?? '',
      client: { id: p.client.id, name: p.client.companyName },
      projectManager: p.pm ? { id: p.pm.id, name: p.pm.fullName } : null,
      teamMembers: p.teamMembers.map(a => ({ id: a.user.id, name: a.user.fullName, role: a.projectRole ?? '' })),
      milestones: p.milestones.map(m => ({ id: m.id, name: m.title, dueDate: m.dueDate?.toISOString() ?? null, status: m.status ?? '' })),
      rfas: p.rfas.map(r => ({ id: r.id, rfaNumber: r.title, status: r.status as string ?? '' })),
      startDate: p.startDate?.toISOString() ?? null, endDate: p.targetGoLiveDate?.toISOString() ?? null,
    };
  }

  async getTask(id: string): Promise<TaskContext> {
    const t = await this.prisma.task.findUnique({
      where: { id },
      select: {
        id: true, title: true, status: true, priority: true, dueDate: true, estimatedHours: true,
        assignedTo: { select: { id: true, fullName: true } },
        project: { select: { id: true, projectName: true } },
      },
    });
    if (!t) throw new NotFoundException(`Task ${id} not found`);
    return {
      id: t.id, title: t.title, status: t.status ?? '', priority: t.priority ?? '',
      assignee: t.assignedTo ? { id: t.assignedTo.id, name: t.assignedTo.fullName } : null,
      project: t.project ? { id: t.project.id, name: t.project.projectName } : null,
      dueDate: t.dueDate?.toISOString() ?? null, estimatedHours: t.estimatedHours ? Number(t.estimatedHours) : null,
    };
  }

  async getMeeting(id: string): Promise<MeetingContext> {
    const m = await this.prisma.meeting.findUnique({
      where: { id },
      select: {
        id: true, title: true, meetingType: true, meetingDate: true,
        transcriptRaw: true, aiSummary: true, actionItems: true, participants: true
      },
    });
    if (!m) throw new NotFoundException(`Meeting ${id} not found`);
    return {
      id: m.id, title: m.title, meetingType: m.meetingType ?? '',
      scheduledAt: m.meetingDate.toISOString(),
      attendees: m.participants,
      transcript: m.transcriptRaw ?? null, aiSummary: m.aiSummary ?? null, actionItems: m.actionItems ? String(m.actionItems) : null,
    };
  }

  async getTeamMember(id: string): Promise<TeamMemberContext> {
    const u = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true, fullName: true, email: true, role: true, department: true,
        projectTeams: { where: { project: { status: { not: 'completed' } } }, select: { project: { select: { id: true, projectName: true } } } },
        timeLogs: {
          where: { date: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } },
          select: { hours: true },
        },
      },
    });
    if (!u) throw new NotFoundException(`User ${id} not found`);
    const hoursThisWeek = u.timeLogs.reduce((sum, tl) => sum + Number(tl.hours ?? 0), 0);
    return {
      id: u.id, name: u.fullName, email: u.email, role: u.role ?? '', department: u.department ?? '',
      activeProjects: u.projectTeams.map(a => ({ id: a.project.id, name: a.project.projectName })),
      hoursLoggedThisWeek: hoursThisWeek,
    };
  }

  async listClients(filters?: ClientFilters): Promise<ClientSummary[]> {
    const where: any = { deletedAt: null };
    if (filters?.tier) where.tier = filters.tier;
    if (filters?.lifecycleStage) where.lifecycleStage = filters.lifecycleStage;
    if (filters?.assignedAmId) where.assignedAccountManagerId = filters.assignedAmId;
    const clients = await this.prisma.client.findMany({
      where, take: 50,
      select: { id: true, companyName: true, tier: true, lifecycleStage: true, clientHealthScore: true },
    });
    return clients.map(c => ({ id: c.id, name: c.companyName, tier: c.tier ?? '', lifecycleStage: c.lifecycleStage ?? '', healthScore: c.clientHealthScore ?? 0 }));
  }

  async listProjects(filters?: ProjectFilters): Promise<ProjectSummary[]> {
    const where: any = {};
    if (filters?.status) where.status = filters.status;
    if (filters?.phase) where.phase = filters.phase;
    if (filters?.clientId) where.clientId = filters.clientId;
    if (filters?.assignedPmId) where.assignedPmId = filters.assignedPmId;
    const projects = await this.prisma.project.findMany({
      where, take: 50,
      select: { id: true, projectName: true, phase: true, status: true, client: { select: { companyName: true } } },
    });
    return projects.map(p => ({ id: p.id, name: p.projectName, phase: p.phase ?? '', status: p.status ?? '', clientName: p.client.companyName }));
  }

  async listTasks(filters?: TaskFilters): Promise<TaskSummary[]> {
    const where: any = {};
    if (filters?.status) where.status = filters.status;
    if (filters?.priority) where.priority = filters.priority;
    if (filters?.assigneeId) where.assignedToId = filters.assigneeId;
    if (filters?.projectId) where.projectId = filters.projectId;
    const tasks = await this.prisma.task.findMany({
      where, take: 50,
      select: { id: true, title: true, status: true, priority: true, dueDate: true },
    });
    return tasks.map(t => ({ id: t.id, title: t.title, status: t.status ?? '', priority: t.priority ?? '', dueDate: t.dueDate?.toISOString() ?? null }));
  }

  async getMasterDataGroup(code: string): Promise<MasterDataGroupContext> {
    const g = await (this.prisma as any).masterDataGroup.findUnique({
      where: { code },
      include: { values: { where: { isActive: true }, orderBy: { sortOrder: 'asc' } } },
    });
    if (!g) throw new NotFoundException(`Master data group '${code}' not found`);
    return {
      code: g.code, name: g.name,
      values: g.values.map((v: any) => ({ code: v.code, label: v.label, color: v.color ?? '', metadata: v.metadata })),
    };
  }

  async getAiApp(id: string): Promise<AiAppContext> {
    const app = await this.prisma.aiApp.findUnique({
      where: { id },
      select: { id: true, name: true, claudeMdInstruction: true, maxContextTokens: true, steps: true },
    });
    if (!app) throw new NotFoundException(`AI App ${id} not found`);
    return {
      id: app.id, name: app.name, contextType: (app as any).contextType ?? '',
      claudeMd: app.claudeMdInstruction ?? '',
      maxTokens: app.maxContextTokens ?? 4096, steps: app.steps,
    };
  }

  async createTimelog(data: CreateTimelogDto): Promise<void> {
    await this.prisma.timeLog.create({
      data: {
        taskId: data.taskId, userId: data.userId, hours: data.hours,
        description: data.description, date: data.loggedAt ?? new Date(),
      },
    });
  }

  async createTask(data: CreateTaskDto): Promise<void> {
    await this.prisma.task.create({
      data: {
        title: data.title, projectId: data.projectId, assignedToId: data.assigneeId,
        priority: (data.priority as any) ?? 'medium', dueDate: data.dueDate,
        estimatedHours: data.estimatedHours, status: 'todo',
      },
    });
  }

  async updateTaskStatus(taskId: string, status: string): Promise<void> {
    await this.prisma.task.update({ where: { id: taskId }, data: { status: status as any, updatedAt: new Date() } });
  }
}
