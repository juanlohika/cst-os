import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { DealStage } from '@prisma/client';

@Injectable()
export class PipelineService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: { stage?: DealStage; search?: string; limit?: number; offset?: number }) {
    const { stage, search, limit = 50, offset = 0 } = query;
    const where: any = {};
    if (stage) where.dealStage = stage;
    if (search) {
      where.OR = [
        { companyName: { contains: search, mode: 'insensitive' } },
        { contactName: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.acquisitionPipeline.findMany({
        where,
        orderBy: { updatedAt: 'desc' },
        take: limit,
        skip: offset,
        include: {
          projectedAssignedTo: { select: { id: true, fullName: true, profilePhotoUrl: true } },
          createdBy: { select: { id: true, fullName: true } },
        },
      }),
      this.prisma.acquisitionPipeline.count({ where }),
    ]);

    return { data, total };
  }

  async findOne(id: string) {
    const deal = await this.prisma.acquisitionPipeline.findUnique({
      where: { id },
      include: {
        projectedAssignedTo: { select: { id: true, fullName: true, profilePhotoUrl: true } },
        createdBy: { select: { id: true, fullName: true } },
      },
    });
    if (!deal) throw new NotFoundException(`Deal ${id} not found`);
    return deal;
  }

  async create(dto: {
    companyName: string;
    dealStage?: DealStage;
    probability?: number;
    estimatedGoLiveDate?: Date;
    projectedAssignedToId?: string;
    contactName?: string;
    contactEmail?: string;
    industry?: string;
    notes?: string;
    requiresPoc?: boolean;
    pocDescription?: string;
  }, createdById?: string) {
    const ref = `PIPE-${Date.now().toString(36).toUpperCase()}`;
    return this.prisma.acquisitionPipeline.create({
      data: { ...dto, pipelineRef: ref, createdById },
      include: {
        projectedAssignedTo: { select: { id: true, fullName: true } },
      },
    });
  }

  async update(id: string, dto: Partial<{
    companyName: string;
    dealStage: DealStage;
    probability: number;
    estimatedGoLiveDate: Date;
    projectedAssignedToId: string;
    contactName: string;
    contactEmail: string;
    industry: string;
    notes: string;
    requiresPoc: boolean;
    pocDescription: string;
    convertedClientId: string;
  }>) {
    await this.findOne(id);
    return this.prisma.acquisitionPipeline.update({
      where: { id },
      data: dto,
      include: {
        projectedAssignedTo: { select: { id: true, fullName: true } },
      },
    });
  }

  async stageStats() {
    const stages = Object.values(DealStage);
    const counts = await Promise.all(
      stages.map((s) => this.prisma.acquisitionPipeline.count({ where: { dealStage: s } })),
    );
    return stages.map((stage, i) => ({ stage, count: counts[i] }));
  }
}
