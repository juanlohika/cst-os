import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { KpiPeriodStatus } from '@prisma/client';

@Injectable()
export class KpiService {
  constructor(private readonly prisma: PrismaService) {}

  // ── Periods ─────────────────────────────────────────────────────────────────

  async listPeriods() {
    return this.prisma.kpiPeriod.findMany({
      orderBy: [{ year: 'desc' }, { month: 'desc' }],
      take: 24,
      include: { _count: { select: { scorecardInstances: true } } },
    });
  }

  async getOrCreatePeriod(year: number, month: number) {
    const label = new Date(year, month - 1).toLocaleString('en-US', { month: 'long', year: 'numeric' });
    return this.prisma.kpiPeriod.upsert({
      where: { year_month: { year, month } },
      create: { year, month, label },
      update: {},
    });
  }

  async lockPeriod(id: string) {
    return this.prisma.kpiPeriod.update({
      where: { id },
      data: { status: KpiPeriodStatus.locked, lockedAt: new Date() },
    });
  }

  // ── Scorecards ───────────────────────────────────────────────────────────────

  async listScorecards(periodId: string) {
    return this.prisma.kpiScorecardInstance.findMany({
      where: { periodId },
      include: {
        user: { select: { id: true, fullName: true, role: true, profilePhotoUrl: true } },
        period: true,
        template: { select: { id: true, name: true, targetRole: true } },
        metricScores: {
          include: { metric: { include: { category: true } } },
        },
      },
      orderBy: { totalScore: 'desc' },
    });
  }

  async getScorecard(userId: string, periodId: string) {
    const instance = await this.prisma.kpiScorecardInstance.findUnique({
      where: { userId_periodId: { userId, periodId } },
      include: {
        user: { select: { id: true, fullName: true, role: true, profilePhotoUrl: true } },
        period: true,
        template: {
          include: {
            categories: {
              include: { metrics: true },
              orderBy: { sortOrder: 'asc' },
            },
          },
        },
        metricScores: {
          include: { metric: { include: { category: true } } },
        },
      },
    });
    if (!instance) throw new NotFoundException('Scorecard not found');
    return instance;
  }

  async createOrUpdateInstance(dto: {
    userId: string;
    periodId: string;
    templateId: string;
  }) {
    return this.prisma.kpiScorecardInstance.upsert({
      where: { userId_periodId: { userId: dto.userId, periodId: dto.periodId } },
      create: dto,
      update: {},
      include: {
        user: { select: { id: true, fullName: true, role: true } },
        period: true,
        template: true,
      },
    });
  }

  async updateMetricScore(instanceId: string, metricId: string, rawScore: number) {
    const score = await this.prisma.metricScore.upsert({
      where: { instanceId_metricId: { instanceId, metricId } },
      create: { instanceId, metricId, rawScore },
      update: { rawScore },
      include: { metric: { include: { category: true } } },
    });

    // Recalculate total score
    const allScores = await this.prisma.metricScore.findMany({
      where: { instanceId },
      include: { metric: true },
    });
    const total = allScores.reduce((sum, s) => {
      return sum + (Number(s.rawScore ?? 0) * Number(s.metric.weight));
    }, 0);
    await this.prisma.kpiScorecardInstance.update({
      where: { id: instanceId },
      data: { totalScore: total, lastCalcAt: new Date() },
    });

    return score;
  }

  // ── Templates ────────────────────────────────────────────────────────────────

  async listTemplates() {
    return this.prisma.kpiScorecardTemplate.findMany({
      include: {
        categories: {
          include: { metrics: { orderBy: { sortOrder: 'asc' } } },
          orderBy: { sortOrder: 'asc' },
        },
      },
    });
  }
}
