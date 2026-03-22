import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { QueryClientsDto } from './dto/query-clients.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ClientsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateClientDto, createdById?: string) {
    return this.prisma.client.create({
      data: { ...dto, createdById },
      include: {
        accountMgr: { select: { id: true, fullName: true, email: true } },
      },
    });
  }

  async findAll(query: QueryClientsDto) {
    const {
      status,
      segment,
      lifecycleStage,
      accountManagerId,
      search,
      page = 1,
      limit = 25,
    } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.ClientWhereInput = {
      ...(status && { status }),
      ...(segment && { segment }),
      ...(lifecycleStage && { lifecycleStage }),
      ...(accountManagerId && { assignedAccountManagerId: accountManagerId }),
      ...(search && {
        OR: [
          { companyName: { contains: search, mode: 'insensitive' } },
          { industry: { contains: search, mode: 'insensitive' } },
          { primaryContactName: { contains: search, mode: 'insensitive' } },
          { primaryContactEmail: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.client.findMany({
        where,
        skip,
        take: limit,
        orderBy: { companyName: 'asc' },
        include: {
          accountMgr: { select: { id: true, fullName: true, profilePhotoUrl: true } },
          parentClient: { select: { id: true, companyName: true } },
          _count: { select: { projects: true, contacts: true, childClients: true } },
        },
      }),
      this.prisma.client.count({ where }),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string) {
    const client = await this.prisma.client.findUnique({
      where: { id },
      include: {
        accountMgr: { select: { id: true, fullName: true, email: true, profilePhotoUrl: true } },
        parentClient: { select: { id: true, companyName: true } },
        childClients: { select: { id: true, companyName: true, status: true, tier: true, lifecycleStage: true } },
        teamMembers: {
          include: { user: { select: { id: true, fullName: true, role: true } } },
        },
        contacts: { where: { isActive: true }, orderBy: { isPrimary: 'desc' } },
        projects: {
          select: {
            id: true,
            projectName: true,
            status: true,
            phase: true,
            assignedPmId: true,
          },
          orderBy: { createdAt: 'desc' },
        },
        courtesyCallTier: true,
        _count: {
          select: {
            projects: true,
            contacts: true,
            meetings: true,
            rfas: true,
            csatSurveys: true,
          },
        },
      },
    });
    if (!client) throw new NotFoundException(`Client ${id} not found`);
    return client;
  }

  async update(id: string, dto: UpdateClientDto) {
    await this.findOne(id);
    return this.prisma.client.update({
      where: { id },
      data: dto,
      include: {
        accountMgr: { select: { id: true, fullName: true } },
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.client.update({
      where: { id },
      data: { status: 'churned' },
    });
  }

  async calculateHealthScore(id: string): Promise<number> {
    const client = await this.prisma.client.findUnique({
      where: { id },
      include: {
        projects: { select: { status: true, riskLevel: true } },
        csatSurveys: {
          select: { scoreOverallRecommendation: true },
          orderBy: { createdAt: 'desc' },
          take: 3,
        },
        rfas: { select: { status: true }, orderBy: { createdAt: 'desc' }, take: 10 },
      },
    });
    if (!client) throw new NotFoundException(`Client ${id} not found`);

    let score = 70; // baseline

    // Active projects boost, cancelled/at-risk reduce
    const activeProjects = client.projects.filter((p) => p.status === 'active').length;
    const highRiskProjects = client.projects.filter(
      (p) => p.riskLevel === 'high' || p.riskLevel === 'critical',
    ).length;
    score += activeProjects * 5;
    score -= highRiskProjects * 10;

    // CSAT scores
    const csatScores = client.csatSurveys
      .map((s) => s.scoreOverallRecommendation)
      .filter(Boolean) as number[];
    if (csatScores.length > 0) {
      const avgCsat = csatScores.reduce((a, b) => a + b, 0) / csatScores.length;
      score = score * 0.7 + avgCsat * 10 * 0.3; // blend
    }

    // Rejected RFAs reduce score
    const rejectedRfas = client.rfas.filter((r) => r.status === 'rejected').length;
    score -= rejectedRfas * 3;

    const finalScore = Math.max(0, Math.min(100, Math.round(score)));

    await this.prisma.client.update({
      where: { id },
      data: { clientHealthScore: finalScore },
    });

    return finalScore;
  }

  // ── Contacts ────────────────────────────────────────────────────────────────

  async findContacts(clientId: string) {
    await this.findOne(clientId);
    return this.prisma.clientContact.findMany({
      where: { clientId },
      orderBy: [{ isPrimary: 'desc' }, { fullName: 'asc' }],
    });
  }

  async createContact(clientId: string, data: {
    fullName: string;
    position?: string;
    department?: string;
    email?: string;
    mobile?: string;
    contactType?: string;
    isPrimary?: boolean;
    source?: string;
  }) {
    await this.findOne(clientId);
    if (data.isPrimary) {
      await this.prisma.clientContact.updateMany({
        where: { clientId },
        data: { isPrimary: false },
      });
    }
    return this.prisma.clientContact.create({
      data: { clientId, ...data } as any,
    });
  }

  async updateContact(clientId: string, contactId: string, data: any) {
    const contact = await this.prisma.clientContact.findFirst({
      where: { id: contactId, clientId },
    });
    if (!contact) throw new NotFoundException(`Contact ${contactId} not found`);
    if (data.isPrimary) {
      await this.prisma.clientContact.updateMany({
        where: { clientId },
        data: { isPrimary: false },
      });
    }
    return this.prisma.clientContact.update({ where: { id: contactId }, data });
  }

  async deleteContact(clientId: string, contactId: string) {
    const contact = await this.prisma.clientContact.findFirst({
      where: { id: contactId, clientId },
    });
    if (!contact) throw new NotFoundException(`Contact ${contactId} not found`);
    return this.prisma.clientContact.update({
      where: { id: contactId },
      data: { isActive: false },
    });
  }

  // ── CSAT ────────────────────────────────────────────────────────────────────

  async listCsat(clientId?: string) {
    return this.prisma.csatSurvey.findMany({
      where: clientId ? { clientId } : undefined,
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: {
        client:    { select: { id: true, companyName: true } },
        project:   { select: { id: true, projectName: true } },
        createdBy: { select: { id: true, fullName: true } },
      },
    });
  }

  async createCsat(dto: {
    clientId: string;
    projectId?: string;
    surveyType: string;
    respondentName?: string;
    respondentEmail?: string;
    scoreAppAndDashboard?: number;
    scoreImplementationManager?: number;
    scoreOverallRecommendation?: number;
    comments?: string;
  }, createdById?: string) {
    const surveyRef = `CSAT-${Date.now().toString(36).toUpperCase()}`;
    return this.prisma.csatSurvey.create({
      data: { ...dto, surveyRef, createdById, respondedAt: new Date() } as any,
      include: {
        client:    { select: { id: true, companyName: true } },
        project:   { select: { id: true, projectName: true } },
        createdBy: { select: { id: true, fullName: true } },
      },
    });
  }

  // ── Courtesy Calls ──────────────────────────────────────────────────────────

  async getCourtesyCallCompliance(year: number, month: number) {
    const periodStart = new Date(year, month - 1, 1);
    const periodEnd   = new Date(year, month, 0, 23, 59, 59);

    const [clients, assignments] = await Promise.all([
      this.prisma.client.findMany({
        where: { deletedAt: null },
        select: {
          id: true, companyName: true, tier: true,
          accountMgr: { select: { id: true, fullName: true, profilePhotoUrl: true } },
        },
        orderBy: { companyName: 'asc' },
      }),
      this.prisma.courtesyCallAssignment.findMany({
        where: { targetMonth: { gte: periodStart, lte: periodEnd } },
      }),
    ]);

    return { clients, assignments };
  }

  async logCourtesyCall(clientId: string, dto: {
    assignedToId: string;
    notes?: string;
    year: number;
    month: number;
  }) {
    const targetMonth = new Date(dto.year, dto.month - 1, 1);
    const existing = await this.prisma.courtesyCallAssignment.findFirst({
      where: { clientId, assignedToId: dto.assignedToId, targetMonth },
    });

    // Get the client's tier to find the right tierId
    const client = await this.prisma.client.findUnique({
      where: { id: clientId },
      include: { courtesyCallTier: true },
    });
    const tierId = (client as any)?.courtesyCallTierId;

    if (existing) {
      return this.prisma.courtesyCallAssignment.update({
        where: { id: existing.id },
        data: {
          completedCallCount: { increment: 1 },
          status: 'completed',
          notes: dto.notes ?? existing.notes,
        },
      });
    }

    return this.prisma.courtesyCallAssignment.create({
      data: {
        clientId,
        assignedToId: dto.assignedToId,
        tierId: tierId ?? (await this.prisma.courtesyCallTier.findFirst())!.id,
        targetMonth,
        plannedCallCount: 1,
        completedCallCount: 1,
        status: 'completed',
        notes: dto.notes,
      },
    });
  }

  async exportAll() {
    return this.prisma.client.findMany({
      orderBy: { companyName: 'asc' },
      select: {
        id: true,
        companyName: true,
        industry: true,
        companySize: true,
        subscriptionPlan: true,
        status: true,
        lifecycleStage: true,
        segment: true,
        clientHealthScore: true,
        primaryContactName: true,
        primaryContactEmail: true,
        primaryContactPhone: true,
        contractStartDate: true,
        contractEndDate: true,
        tags: true,
      },
    });
  }
}
