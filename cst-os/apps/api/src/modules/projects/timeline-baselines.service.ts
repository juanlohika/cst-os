import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';

@Injectable()
export class TimelineBaselinesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(projectType?: string) {
    return this.prisma.timelineBaselineVersion.findMany({
      where: projectType ? { projectType: projectType as any } : undefined,
      orderBy: [{ projectType: 'asc' }, { createdAt: 'desc' }],
    });
  }

  async create(dto: {
    projectType: string;
    versionLabel: string;
    totalWorkingDays: number;
    minDays: number;
    maxDays: number;
    phaseNorms: any;
    notes?: string;
    createdById?: string;
  }) {
    return this.prisma.timelineBaselineVersion.create({ data: dto as any });
  }

  async activate(id: string) {
    const version = await this.prisma.timelineBaselineVersion.findUnique({ where: { id } });
    if (!version) throw new Error('Version not found');
    // Deactivate all other versions of same project type
    await this.prisma.timelineBaselineVersion.updateMany({
      where: { projectType: version.projectType, isActive: true },
      data: { isActive: false, archivedAt: new Date() },
    });
    return this.prisma.timelineBaselineVersion.update({
      where: { id },
      data: { isActive: true, activatedAt: new Date(), archivedAt: null },
    });
  }

  async archive(id: string) {
    return this.prisma.timelineBaselineVersion.update({
      where: { id },
      data: { isActive: false, archivedAt: new Date() },
    });
  }

  async update(id: string, dto: Partial<{ versionLabel: string; notes: string; totalWorkingDays: number; minDays: number; maxDays: number; phaseNorms: any }>) {
    return this.prisma.timelineBaselineVersion.update({ where: { id }, data: dto as any });
  }
}
