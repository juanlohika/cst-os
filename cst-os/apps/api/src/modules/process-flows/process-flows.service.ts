import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { Prisma, ProcessFlowType } from '@prisma/client';

const PF_INCLUDE = {
  project: { select: { id: true, projectName: true } },
  client: { select: { id: true, companyName: true } },
  brd: { select: { id: true, title: true } },
};

@Injectable()
export class ProcessFlowsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: {
    projectId: string;
    clientId: string;
    title: string;
    flowType: ProcessFlowType;
    description?: string;
    brdId?: string;
    meetingId?: string;
    sourceText?: string;
    diagramDefinition?: string;
    generatedBy?: string;
  }, createdById?: string) {
    return this.prisma.processFlow.create({
      data: {
        projectId: dto.projectId,
        clientId: dto.clientId,
        title: dto.title,
        flowType: dto.flowType,
        description: dto.description,
        brdId: dto.brdId,
        meetingId: dto.meetingId,
        sourceText: dto.sourceText,
        diagramDefinition: dto.diagramDefinition,
        generatedBy: dto.generatedBy ?? 'manual',
        createdById,
      },
      include: PF_INCLUDE,
    });
  }

  async findAll(query: { clientId?: string; projectId?: string; flowType?: ProcessFlowType; page?: number; limit?: number }) {
    const { clientId, projectId, flowType, page = 1, limit = 25 } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.ProcessFlowWhereInput = {
      ...(clientId && { clientId }),
      ...(projectId && { projectId }),
      ...(flowType && { flowType }),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.processFlow.findMany({
        where, skip, take: limit,
        orderBy: { createdAt: 'desc' },
        include: PF_INCLUDE,
      }),
      this.prisma.processFlow.count({ where }),
    ]);

    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string) {
    const pf = await this.prisma.processFlow.findUnique({
      where: { id },
      include: PF_INCLUDE,
    });
    if (!pf) throw new NotFoundException(`Process flow ${id} not found`);
    return pf;
  }

  async update(id: string, dto: { title?: string; description?: string; diagramDefinition?: string; status?: string; sourceText?: string }) {
    await this.findOne(id);
    return this.prisma.processFlow.update({
      where: { id },
      data: {
        ...(dto.title !== undefined && { title: dto.title }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.diagramDefinition !== undefined && { diagramDefinition: dto.diagramDefinition }),
        ...(dto.status !== undefined && { status: dto.status }),
        ...(dto.sourceText !== undefined && { sourceText: dto.sourceText }),
      },
      include: PF_INCLUDE,
    });
  }
}
