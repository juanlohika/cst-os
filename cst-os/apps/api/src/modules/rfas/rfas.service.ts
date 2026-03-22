import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateRfaDto } from './dto/create-rfa.dto';
import { UpdateRfaDto } from './dto/update-rfa.dto';
import { QueryRfasDto } from './dto/query-rfas.dto';
import { Prisma, RfaStatus, TaskType, TaskStatus } from '@prisma/client';

const RFA_INCLUDE = {
  project: { select: { id: true, projectName: true } },
  client: { select: { id: true, companyName: true } },
  requestedBy: { select: { id: true, fullName: true } },
  approvedBy: { select: { id: true, fullName: true } },
  assignedApprover: { select: { id: true, fullName: true } },
};

@Injectable()
export class RfasService {
  constructor(
    private prisma: PrismaService,
    private notifications: NotificationsService,
  ) {}

  async create(dto: CreateRfaDto, requestedById?: string) {
    return this.prisma.rfa.create({
      data: { ...dto, requestedById },
      include: RFA_INCLUDE,
    });
  }

  async findAll(query: QueryRfasDto) {
    const { clientId, projectId, status, requestType, priority, search, page = 1, limit = 25 } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.RfaWhereInput = {
      ...(clientId && { clientId }),
      ...(projectId && { projectId }),
      ...(status && { status }),
      ...(requestType && { requestType }),
      ...(priority && { priority }),
      ...(search && { title: { contains: search, mode: 'insensitive' } }),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.rfa.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: RFA_INCLUDE,
      }),
      this.prisma.rfa.count({ where }),
    ]);

    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string) {
    const rfa = await this.prisma.rfa.findUnique({
      where: { id },
      include: {
        ...RFA_INCLUDE,
        tasks: {
          select: { id: true, title: true, status: true, assignedTo: { select: { id: true, fullName: true } } },
        },
        aiReview: true,
      },
    });
    if (!rfa) throw new NotFoundException(`RFA ${id} not found`);
    return rfa;
  }

  async update(id: string, dto: UpdateRfaDto) {
    await this.findOne(id);
    return this.prisma.rfa.update({
      where: { id },
      data: {
        ...(dto.title !== undefined && { title: dto.title }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.priority !== undefined && { priority: dto.priority }),
        ...(dto.requestType !== undefined && { requestType: dto.requestType }),
        ...(dto.slaDays !== undefined && { slaDays: dto.slaDays }),
        ...(dto.estimatedEffortHours !== undefined && { estimatedEffortHours: dto.estimatedEffortHours }),
        ...(dto.tags !== undefined && { tags: dto.tags }),
        ...(dto.approvalNotes !== undefined && { approvalNotes: dto.approvalNotes }),
      },
      include: RFA_INCLUDE,
    });
  }

  async submit(id: string) {
    const rfa = await this.findOne(id);
    if (rfa.status !== RfaStatus.draft) {
      throw new BadRequestException('Only draft RFAs can be submitted');
    }

    const submittedAt = new Date();

    const updatedRfa = await this.prisma.rfa.update({
      where: { id },
      data: { status: RfaStatus.submitted, submittedAt },
      include: RFA_INCLUDE,
    });

    let dueDate: Date | undefined;
    if (rfa.slaDays) {
      dueDate = new Date(submittedAt);
      dueDate.setDate(dueDate.getDate() + rfa.slaDays);
    }

    await this.prisma.task.create({
      data: {
        title: `Review & Approve RFA: ${rfa.title}`,
        projectId: rfa.projectId,
        rfaId: rfa.id,
        type: TaskType.rfa,
        assignedToId: rfa.assignedApproverId ?? undefined,
        dueDate: dueDate,
        priority: rfa.priority,
        status: TaskStatus.todo,
        description: `RFA requires review. SLA: ${rfa.slaDays ?? 'not set'} days.`,
      },
    });

    try {
      await this.notifications.createFeedEvent({
        eventType: 'rfa_submitted',
        entityType: 'rfa',
        entityId: rfa.id,
        actorId: rfa.requestedById ?? undefined,
        content: `RFA "${rfa.title}" submitted for review`,
        metadata: { projectId: rfa.projectId, clientId: rfa.clientId },
      });
    } catch {
      // Feed event failure must never break RFA submission
    }

    return updatedRfa;
  }

  async approve(id: string, approverId: string, notes?: string) {
    const rfa = await this.findOne(id);
    if (!['submitted', 'under_review'].includes(rfa.status)) {
      throw new BadRequestException('RFA must be submitted or under review to approve');
    }
    const updated = await this.prisma.rfa.update({
      where: { id },
      data: {
        status: RfaStatus.approved,
        approvedById: approverId,
        approvalNotes: notes,
        completionDate: new Date(),
      },
      include: RFA_INCLUDE,
    });

    try {
      await this.notifications.createFeedEvent({
        eventType: 'rfa_approved',
        entityType: 'rfa',
        entityId: rfa.id,
        actorId: approverId,
        content: `RFA "${rfa.title}" approved`,
        metadata: { projectId: rfa.projectId, clientId: rfa.clientId },
      });
    } catch {
      // Feed event failure must never break RFA approval
    }

    return updated;
  }

  async reject(id: string, approverId: string, notes?: string) {
    const rfa = await this.findOne(id);
    if (!['submitted', 'under_review'].includes(rfa.status)) {
      throw new BadRequestException('RFA must be submitted or under review to reject');
    }
    return this.prisma.rfa.update({
      where: { id },
      data: {
        status: RfaStatus.rejected,
        approvedById: approverId,
        approvalNotes: notes,
      },
      include: RFA_INCLUDE,
    });
  }

  async cancel(id: string) {
    await this.findOne(id);
    return this.prisma.rfa.update({
      where: { id },
      data: { status: RfaStatus.cancelled },
      include: RFA_INCLUDE,
    });
  }
}
