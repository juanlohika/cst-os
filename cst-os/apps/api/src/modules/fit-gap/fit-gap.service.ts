import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { Prisma, FitGapStatus } from '@prisma/client';

export interface FitGapRow {
  id?: string;
  processArea: string;
  clientCurrentProcess?: string;
  tarkieStandardCapability?: string;
  gapDescription?: string;
  gapType: 'fit' | 'partial_fit' | 'gap';
  recommendation?: string;
  effortEstimate?: 'low' | 'medium' | 'high';
  priority?: 'critical' | 'high' | 'medium' | 'low';
  rfaRequired?: boolean;
}

const FITGAP_INCLUDE = {
  project: { select: { id: true, projectName: true } },
  client: { select: { id: true, companyName: true } },
  meeting: { select: { id: true, title: true, meetingDate: true } },
  createdBy: { select: { id: true, fullName: true } },
};

@Injectable()
export class FitGapService {
  constructor(private prisma: PrismaService) {}

  async create(dto: { projectId: string; clientId: string; meetingId?: string; rows?: FitGapRow[] }, createdById?: string) {
    return this.prisma.fitGapAnalysis.create({
      data: {
        projectId: dto.projectId,
        clientId: dto.clientId,
        meetingId: dto.meetingId,
        createdById,
        rows: (dto.rows ?? []) as unknown as Prisma.InputJsonValue,
      },
      include: FITGAP_INCLUDE,
    });
  }

  async findAll(query: { clientId?: string; projectId?: string; status?: FitGapStatus; page?: number; limit?: number }) {
    const { clientId, projectId, status, page = 1, limit = 25 } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.FitGapAnalysisWhereInput = {
      ...(clientId && { clientId }),
      ...(projectId && { projectId }),
      ...(status && { status }),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.fitGapAnalysis.findMany({
        where, skip, take: limit,
        orderBy: { createdAt: 'desc' },
        include: FITGAP_INCLUDE,
      }),
      this.prisma.fitGapAnalysis.count({ where }),
    ]);

    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string) {
    const fg = await this.prisma.fitGapAnalysis.findUnique({
      where: { id },
      include: FITGAP_INCLUDE,
    });
    if (!fg) throw new NotFoundException(`Fit-Gap ${id} not found`);
    return fg;
  }

  async update(id: string, dto: { status?: FitGapStatus; rows?: FitGapRow[] }) {
    await this.findOne(id);
    return this.prisma.fitGapAnalysis.update({
      where: { id },
      data: {
        ...(dto.status !== undefined && { status: dto.status }),
        ...(dto.rows !== undefined && { rows: dto.rows as unknown as Prisma.InputJsonValue }),
      },
      include: FITGAP_INCLUDE,
    });
  }
}
