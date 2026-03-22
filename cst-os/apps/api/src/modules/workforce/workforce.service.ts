import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';

@Injectable()
export class WorkforceService {
  constructor(private readonly prisma: PrismaService) {}

  // ── Time Logs ───────────────────────────────────────────────────────────────

  async getTimeLogs(query: {
    userId?: string;
    taskId?: string;
    from?: Date;
    to?: Date;
    limit?: number;
    offset?: number;
  }) {
    const { userId, taskId, from, to, limit = 50, offset = 0 } = query;
    const where: any = {};
    if (userId) where.userId = userId;
    if (taskId) where.taskId = taskId;
    if (from || to) {
      where.date = {};
      if (from) where.date.gte = from;
      if (to) where.date.lte = to;
    }

    const [data, total] = await Promise.all([
      this.prisma.timeLog.findMany({
        where,
        orderBy: { date: 'desc' },
        take: limit,
        skip: offset,
        include: {
          user: { select: { id: true, fullName: true, profilePhotoUrl: true } },
          task: { select: { id: true, title: true, project: { select: { id: true, projectName: true } } } },
        },
      }),
      this.prisma.timeLog.count({ where }),
    ]);

    return { data, total };
  }

  async createTimeLog(dto: {
    taskId: string;
    userId: string;
    date: Date;
    hours: number;
    description?: string;
  }) {
    return this.prisma.timeLog.create({
      data: dto,
      include: {
        user: { select: { id: true, fullName: true } },
        task: { select: { id: true, title: true, project: { select: { id: true, projectName: true } } } },
      },
    });
  }

  async deleteTimeLog(id: string) {
    return this.prisma.timeLog.delete({ where: { id } });
  }

  async getTimeLogSummary(userId?: string) {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay() + 1); // Mon
    startOfWeek.setHours(0, 0, 0, 0);

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const where: any = {};
    if (userId) where.userId = userId;

    const [weekTotal, monthTotal] = await Promise.all([
      this.prisma.timeLog.aggregate({
        where: { ...where, date: { gte: startOfWeek } },
        _sum: { hours: true },
      }),
      this.prisma.timeLog.aggregate({
        where: { ...where, date: { gte: startOfMonth } },
        _sum: { hours: true },
      }),
    ]);

    return {
      weekHours: Number(weekTotal._sum.hours ?? 0),
      monthHours: Number(monthTotal._sum.hours ?? 0),
    };
  }

  // ── Onboarding ───────────────────────────────────────────────────────────────

  async listOnboarding(query: { status?: string; supervisorId?: string }) {
    const where: any = {};
    if (query.status) where.status = query.status;
    if (query.supervisorId) where.supervisorId = query.supervisorId;

    return this.prisma.staffOnboarding.findMany({
      where,
      orderBy: { startDate: 'desc' },
      include: {
        user: { select: { id: true, fullName: true, role: true, profilePhotoUrl: true } },
        supervisor: { select: { id: true, fullName: true } },
      },
    });
  }

  async getOnboarding(id: string) {
    const rec = await this.prisma.staffOnboarding.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, fullName: true, role: true, profilePhotoUrl: true } },
        supervisor: { select: { id: true, fullName: true } },
      },
    });
    if (!rec) throw new NotFoundException('Onboarding record not found');
    return rec;
  }

  async createOnboarding(dto: {
    userId: string;
    supervisorId?: string;
    role: string;
    startDate: Date;
    targetDate?: Date;
    notes?: string;
  }) {
    const defaultChecklist = [
      { id: '1', title: 'System access provisioned', done: false },
      { id: '2', title: 'Email account set up', done: false },
      { id: '3', title: 'Introduce to team', done: false },
      { id: '4', title: 'Complete role orientation', done: false },
      { id: '5', title: 'Shadow senior team member (1 week)', done: false },
      { id: '6', title: 'First solo project assigned', done: false },
      { id: '7', title: 'Complete platform training (Tarkie)', done: false },
      { id: '8', title: 'Complete 30-day check-in', done: false },
      { id: '9', title: 'Complete 60-day review', done: false },
      { id: '10', title: 'Probation sign-off', done: false },
    ];

    return this.prisma.staffOnboarding.create({
      data: { ...dto, checklist: defaultChecklist },
      include: {
        user: { select: { id: true, fullName: true, role: true } },
        supervisor: { select: { id: true, fullName: true } },
      },
    });
  }

  async updateOnboarding(id: string, dto: {
    status?: string;
    checklist?: any[];
    notes?: string;
    targetDate?: Date;
  }) {
    await this.getOnboarding(id);
    return this.prisma.staffOnboarding.update({
      where: { id },
      data: dto as any,
      include: {
        user: { select: { id: true, fullName: true, role: true } },
        supervisor: { select: { id: true, fullName: true } },
      },
    });
  }

  // ── Department Goals ──────────────────────────────────────────────────────────

  async getDepartmentGoals() {
    return this.prisma.departmentGoal.findMany({
      orderBy: [{ role: 'asc' }, { metric: 'asc' }],
    });
  }

  async upsertGoal(dto: {
    role: string;
    metric: string;
    target: number;
    unit?: string;
    notes?: string;
    createdById?: string;
  }) {
    const existing = await this.prisma.departmentGoal.findFirst({
      where: { role: dto.role, metric: dto.metric },
    });

    if (existing) {
      return this.prisma.departmentGoal.update({
        where: { id: existing.id },
        data: { target: dto.target, unit: dto.unit, notes: dto.notes, effectiveFrom: new Date() },
      });
    }

    return this.prisma.departmentGoal.create({ data: dto });
  }

  async deleteGoal(id: string) {
    return this.prisma.departmentGoal.delete({ where: { id } });
  }

  // ── Usage & Targets ───────────────────────────────────────────────────────────

  async getUsageData(periodId: string) {
    const [targets, actuals, users] = await Promise.all([
      this.prisma.usageTarget.findMany({
        where: { periodId },
        include: { user: { select: { id: true, fullName: true, role: true, profilePhotoUrl: true } } },
      }),
      this.prisma.usageActual.findMany({
        where: { periodId },
        include: { user: { select: { id: true, fullName: true } } },
      }),
      this.prisma.user.findMany({
        where: { status: 'active' },
        select: { id: true, fullName: true, role: true, profilePhotoUrl: true },
        orderBy: { fullName: 'asc' },
      }),
    ]);

    const targetMap = new Map(targets.map((t) => [t.userId, t]));
    const actualMap = new Map(actuals.map((a) => [a.userId, a]));

    return users.map((u) => {
      const target = targetMap.get(u.id);
      const actual = actualMap.get(u.id);
      const fieldTarget = target?.fieldAppTarget ?? 0;
      const managerTarget = target?.managerAppTarget ?? 0;
      const fieldActual = actual?.fieldAppActual ?? 0;
      const managerActual = actual?.managerAppActual ?? 0;

      return {
        user: u,
        targetId: target?.id ?? null,
        actualId: actual?.id ?? null,
        fieldAppTarget: fieldTarget,
        managerAppTarget: managerTarget,
        fieldAppActual: fieldActual,
        managerAppActual: managerActual,
        fieldPct: fieldTarget > 0 ? Math.round((fieldActual / fieldTarget) * 100) : null,
        managerPct: managerTarget > 0 ? Math.round((managerActual / managerTarget) * 100) : null,
        lastSyncedAt: actual?.lastSyncedAt ?? null,
      };
    });
  }

  async upsertUsageTarget(dto: { userId: string; periodId: string; fieldAppTarget?: number; managerAppTarget?: number }) {
    return this.prisma.usageTarget.upsert({
      where: { userId_periodId: { userId: dto.userId, periodId: dto.periodId } },
      update: { fieldAppTarget: dto.fieldAppTarget, managerAppTarget: dto.managerAppTarget },
      create: {
        userId: dto.userId,
        periodId: dto.periodId,
        fieldAppTarget: dto.fieldAppTarget ?? 0,
        managerAppTarget: dto.managerAppTarget ?? 0,
      },
    });
  }

  async upsertUsageActual(dto: { userId: string; periodId: string; fieldAppActual?: number; managerAppActual?: number }) {
    return this.prisma.usageActual.upsert({
      where: { userId_periodId: { userId: dto.userId, periodId: dto.periodId } },
      update: {
        fieldAppActual: dto.fieldAppActual,
        managerAppActual: dto.managerAppActual,
        lastSyncedAt: new Date(),
      },
      create: {
        userId: dto.userId,
        periodId: dto.periodId,
        fieldAppActual: dto.fieldAppActual ?? 0,
        managerAppActual: dto.managerAppActual ?? 0,
        lastSyncedAt: new Date(),
      },
    });
  }
}
